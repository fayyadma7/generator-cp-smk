import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, buildUserPrompt } from '../../../modul_ajar_ai_template.js';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.tpText) {
      return NextResponse.json({ error: 'Teks dokumen TP & ATP tidak boleh kosong' }, { status: 400 });
    }

    // Build the user input object expected by the prompt builder
    const userInput = {
      mata_pelajaran: data.subject || 'Belum diisi',
      program_keahlian: data.program || 'Semua Program Keahlian',
      fase: data.phase || 'Belum diisi',
      kelas: data.grade || 'Belum diisi',
      semester: data.semester || 'Ganjil',
      tahun_pelajaran: data.year || '2025/2026',
      target_tp_nomor: data.targetTp || 'Semua TP',
      elemen_cp: data.elemenCP || 'Belum diisi',
      bunyi_tp_lengkap: data.targetTpText || 'Belum diisi',
      konteks_referensi_atp: data.tpText.substring(0, 15000) // Ambil konteks secukupnya
    };

    const userPromptContent = buildUserPrompt(userInput);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // or another supported Groq model like llama3-70b-8192
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPromptContent }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Groq API Error:', errorText);
      return NextResponse.json({ error: 'Gagal menghubungi Groq AI: ' + res.status }, { status: 500 });
    }

    const aiData = await res.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan: ' + error.message },
      { status: 500 }
    );
  }
}
