import { NextResponse } from 'next/server';
import { buildCPPrompt } from '../../../cpGenerator';
import { buildSystemPrompt as buildInsersiSystemPrompt } from '../../../cp_insersi_perkoperasian_prompt';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    const { subject, program, phase, cpText, grade, semester, year, time, teacher } = data;

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
    }

    // Load balancer sederhana menggunakan beberapa key Gemini
    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'API Key Gemini belum diatur di Vercel Environment Variables' }, { status: 500 });
    }

    // Pilih random key (ini dipindah ke dalam loop retry)

    const lowerSubject = (subject || '').toLowerCase();
    const isIPAS = lowerSubject.includes('ipas') || lowerSubject.includes('ilmu pengetahuan alam dan sosial');
    const isKIK = lowerSubject.includes('kik') || lowerSubject.includes('kreativitas, inovasi');
    const isInsersiMapel = isIPAS || isKIK;

    let systemPrompt, userPrompt;

    if (isInsersiMapel) {
      systemPrompt = buildInsersiSystemPrompt(isKIK ? "KIK" : "IPAS");
      const basePrompts = buildCPPrompt({
        mataPelajaran: subject || 'Mata Pelajaran',
        elemenList: data.elemenList || [],
        programKeahlian: program || 'Umum',
        konsentrasiKeahlian: subject || '',
        fase: phase?.replace('Fase ', '') || 'E',
        kelas: grade || 'X',
        semester: semester || 'Ganjil',
        tahunPelajaran: year || '2025/2026',
        namaGuru: teacher || 'Guru',
        alokasiWaktu: time || '144 JP',
      });
      userPrompt = basePrompts.userPrompt + "\n\nPENTING: Terapkan prinsip Insersi Pendidikan Perkoperasian dari System Prompt ke dalam elemen CP, analisis, dan strategi di bawah ini!";
    } else {
      const basePrompts = buildCPPrompt({
        mataPelajaran: subject || 'Mata Pelajaran',
        elemenList: data.elemenList || [],
        programKeahlian: program || 'Umum',
        konsentrasiKeahlian: subject || '',
        fase: phase?.replace('Fase ', '') || 'E',
        kelas: grade || 'X',
        semester: semester || 'Ganjil',
        tahunPelajaran: year || '2025/2026',
        namaGuru: teacher || 'Guru',
        alokasiWaktu: time || '144 JP',
      });
      systemPrompt = basePrompts.systemPrompt;
      userPrompt = basePrompts.userPrompt;
    }

    let insersiElemenFormat = `[
    { "nama": "Nama Elemen 1", "capaian": "Deskripsi CP per elemen yang DIINSERSI dengan nilai perkoperasian" },
    { "nama": "Nama Elemen 2", "capaian": "Deskripsi CP per elemen yang DIINSERSI dengan nilai perkoperasian" }
  ]`;
    let originalElementsText = '';

    if (isInsersiMapel && Array.isArray(data.elemenList) && data.elemenList.length > 0) {
      const exactElements = data.elemenList.map(el => `{ "nama": "${(el.nama || '').replace(/"/g, '\\"')}", "capaian": "[Tulis ulang deskripsi elemen ini dengan menyisipkan nilai perkoperasian]" }`);
      insersiElemenFormat = `[
    ${exactElements.join(',\\n    ')}
  ]`;
      originalElementsText = `\\n\\nElemen CP Asli yang harus di-insersi:\\n` + data.elemenList.map(el => `- **${el.nama}**: ${el.capaian}`).join('\\n');
    }

    const jsonFormat = isInsersiMapel ? `{
  "elemenList": ${insersiElemenFormat},
  "analisis": {
    "kompetensiInti": "Sebutkan Pengetahuan, Keterampilan, dan Sikap secara spesifik",
    "koneksiIndustri": "Relevansi CP dengan minimal 3 jenis pekerjaan/industri (termasuk Koperasi)",
    "koneksiLokal": "5-6 tema projek kontekstual berkaitan potensi lokal dan koperasi"
  },
  "dimensiProfil": {
    "dimensi1": "Kaitan dengan Keimanan...",
    "dimensi2": "Kaitan dengan Kewargaan...",
    "dimensi3": "Kaitan dengan Penalaran Kritis...",
    "dimensi4": "Kaitan dengan Kreativitas...",
    "dimensi5": "Kaitan dengan Kemandirian...",
    "dimensi6": "Kaitan dengan Kolaborasi...",
    "dimensi7": "Kaitan dengan Komunikasi...",
    "dimensi8": "Kaitan dengan Kesehatan..."
  },
  "deepLearning": {
    "mindful": "3-4 aktivitas mindful spesifik (termasuk nilai koperasi)",
    "meaningful": "3-4 cara materi dikaitkan konteks DUDI lokal & Koperasi",
    "joyful": "3-4 aktivitas pembelajaran menyenangkan (simulasi koperasi dll)"
  },
  "strategi": {
    "model": "Model pembelajaran prioritas (misal PjBL koperasi)",
    "asesmen": "Pendekatan asesmen",
    "media": "Sumber & media belajar",
    "alat": "Alat/perangkat tersedia"
  },
  "catatanPengembangan": {
    "catatan": "Catatan kontekstualisasi CP dengan insersi perkoperasian",
    "tantangan": "2-3 tantangan dan solusi"
  }
}` : `{
  "analisis": {
    "kompetensiInti": "Sebutkan Pengetahuan, Keterampilan, dan Sikap secara spesifik",
    "koneksiIndustri": "Relevansi CP dengan minimal 3 jenis pekerjaan/industri",
    "koneksiLokal": "5-6 tema projek kontekstual berkaitan potensi lokal"
  },
  "dimensiProfil": {
    "dimensi1": "Kaitan dengan Keimanan...",
    "dimensi2": "Kaitan dengan Kewargaan...",
    "dimensi3": "Kaitan dengan Penalaran Kritis...",
    "dimensi4": "Kaitan dengan Kreativitas...",
    "dimensi5": "Kaitan dengan Kemandirian...",
    "dimensi6": "Kaitan dengan Kolaborasi...",
    "dimensi7": "Kaitan dengan Komunikasi...",
    "dimensi8": "Kaitan dengan Kesehatan..."
  },
  "deepLearning": {
    "mindful": "3-4 aktivitas mindful spesifik",
    "meaningful": "3-4 cara materi dikaitkan konteks DUDI lokal",
    "joyful": "3-4 aktivitas pembelajaran menyenangkan"
  },
  "strategi": {
    "model": "Model pembelajaran prioritas",
    "asesmen": "Pendekatan asesmen",
    "media": "Sumber & media belajar",
    "alat": "Alat/perangkat tersedia"
  },
  "catatanPengembangan": {
    "catatan": "Catatan kontekstualisasi CP",
    "tantangan": "2-3 tantangan dan solusi"
  }
}`;

    const finalUserPrompt = `${userPrompt}

Teks CP Asli (sebagai bahan dasar):
${cpText}${originalElementsText}

Output harus HANYA berupa JSON persis dengan struktur berikut. PASTIKAN SELURUH PROPERTY DIISI:
${jsonFormat}`;

    // Memanggil API Gemini dengan Retry dan Key Rotation
    let retryCount = 0;
    let success = false;
    let aiData = null;
    let textOutput = '';
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    while (retryCount < 5 && !success) {
      const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
      
      try {
        console.log(`Generate CP attempt ${retryCount + 1} dengan key acak...`);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: finalUserPrompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.4 }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Gemini API Error (attempt ${retryCount + 1}):`, response.status, errorText.slice(0, 100));
          if (response.status === 429 || response.status >= 500) {
            throw new Error(`RETRYABLE_${response.status}`);
          }
          // Error 400 atau 403, gagal permanen
          return NextResponse.json({ error: 'Gagal menghubungi Gemini AI: ' + response.statusText }, { status: response.status });
        }

        aiData = await response.json();
        textOutput = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!textOutput) {
          throw new Error('RETRYABLE_EMPTY');
        }

        // Coba parse untuk memastikan JSON valid
        JSON.parse(textOutput);
        success = true;
      } catch (err) {
        if (err.message.includes('RETRYABLE') || err.message.includes('Unexpected')) { // Unexpected token = JSON parse error
          retryCount++;
          if (retryCount >= 5) {
            return NextResponse.json({ error: 'Batas request API tercapai (Rate Limit). Semua key sedang sibuk. Silakan tunggu 1 menit dan coba lagi.' }, { status: 429 });
          }
          await delay(3000 * retryCount);
        } else {
          throw err;
        }
      }
    }

    const result = JSON.parse(textOutput);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
