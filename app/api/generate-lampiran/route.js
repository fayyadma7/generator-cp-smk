import { NextResponse } from 'next/server';
import {
  SYSTEM_PROMPT_GLOBAL,
  PROMPT_HEADER_DAN_DAFTAR,
  PROMPT_LKPD_PERTEMUAN_1,
  PROMPT_LKPD_PERTEMUAN_2,
  PROMPT_ASESMEN_FORMATIF,
  PROMPT_ASESMEN_SUMATIF,
  PROMPT_REKAP_KELAS,
  PROMPT_MEDIA_PEMBELAJARAN,
  PROMPT_LEMBAR_REFLEKSI,
  PROMPT_BAHAN_PENGAYAAN,
  PROMPT_BAHAN_REMEDIASI
} from '../../../lampiranPrompts';
import { generate, parseAIResult } from '../../../lib/aiClient';

export const runtime = 'nodejs';
export const maxDuration = 120;



export async function POST(request) {
  try {
    const inputGuru = await request.json();

    const prompts = [
      { key: 'headerDanDaftar', prompt: PROMPT_HEADER_DAN_DAFTAR(inputGuru) },
      { key: 'lkpd01a', prompt: PROMPT_LKPD_PERTEMUAN_1(inputGuru) },
      { key: 'lkpd01b', prompt: PROMPT_LKPD_PERTEMUAN_2(inputGuru) },
      { key: 'asesmenFormatif', prompt: PROMPT_ASESMEN_FORMATIF(inputGuru) },
      { key: 'asesmenSumatif', prompt: PROMPT_ASESMEN_SUMATIF(inputGuru) },
      { key: 'rekapKelas', prompt: PROMPT_REKAP_KELAS(inputGuru) },
      { key: 'mediaPembelajaran', prompt: PROMPT_MEDIA_PEMBELAJARAN(inputGuru) },
      { key: 'lembarRefleksi', prompt: PROMPT_LEMBAR_REFLEKSI(inputGuru) },
      { key: 'bahanPengayaan', prompt: PROMPT_BAHAN_PENGAYAAN(inputGuru) },
      { key: 'bahanRemediasi', prompt: PROMPT_BAHAN_REMEDIASI(inputGuru) }
    ];

    // Jalankan semua call secara paralel — aiClient otomatis failover ke NVIDIA/Groq jika Gemini limit
    const results = await Promise.all(prompts.map(async (item) => {
      try {
        const aiResult = await generate({
          system: SYSTEM_PROMPT_GLOBAL,
          user: item.prompt,
          jsonMode: true,
        });
        console.log(`[generate-lampiran] ${item.key} via ${aiResult.provider}`);
        return { [item.key]: parseAIResult(aiResult.text) };
      } catch (e) {
        console.error(`Error generating ${item.key}:`, e);
        return { [item.key]: { error: e.message } };
      }
    }));

    const finalData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    return NextResponse.json(finalData);

  } catch (error) {
    console.error('Error in /api/generate-lampiran:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan saat memproses permintaan' }, { status: 500 });
  }
}
