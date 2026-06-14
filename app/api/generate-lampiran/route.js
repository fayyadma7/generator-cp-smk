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

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

// ── Helper: panggil AI satu prompt, return JSON ──
async function callGemini(systemPrompt, userPrompt) {
  try {
    const res = await generate({
      system: systemPrompt,
      user: userPrompt,
      jsonMode: true
    });
    const parsed = parseAIResult(res.text);
    if (!parsed) throw new Error("Format JSON dari AI tidak valid");
    return parsed;
  } catch (err) {
    throw new Error(`AI Gagal: ${err.message}`);
  }
}

export async function POST(request) {
  try {
    const inputGuru = await request.json();

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    // Daftar semua prompt yang tersedia
    const allPrompts = [
      { key: 'headerDanDaftar',    prompt: PROMPT_HEADER_DAN_DAFTAR(inputGuru) },
      { key: 'lkpd01a',            prompt: PROMPT_LKPD_PERTEMUAN_1(inputGuru) },
      { key: 'lkpd01b',            prompt: PROMPT_LKPD_PERTEMUAN_2(inputGuru) },
      { key: 'asesmenFormatif',    prompt: PROMPT_ASESMEN_FORMATIF(inputGuru) },
      { key: 'asesmenSumatif',     prompt: PROMPT_ASESMEN_SUMATIF(inputGuru) },
      { key: 'rekapKelas',         prompt: PROMPT_REKAP_KELAS(inputGuru) },
      { key: 'mediaPembelajaran',  prompt: PROMPT_MEDIA_PEMBELAJARAN(inputGuru) },
      { key: 'lembarRefleksi',     prompt: PROMPT_LEMBAR_REFLEKSI(inputGuru) },
      { key: 'bahanPengayaan',     prompt: PROMPT_BAHAN_PENGAYAAN(inputGuru) },
      { key: 'bahanRemediasi',     prompt: PROMPT_BAHAN_REMEDIASI(inputGuru) },
    ];

    // Filter hanya key yang diminta (untuk retry parsial dari frontend)
    let prompts = allPrompts;
    if (inputGuru.keysToGenerate && Array.isArray(inputGuru.keysToGenerate)) {
      prompts = allPrompts.filter((p) => inputGuru.keysToGenerate.includes(p.key));
    }

    const finalResults = {};

    // Proses tiap item dengan retry
    for (const item of prompts) {
      let retryCount = 0;
      let success = false;

      while (retryCount < 6 && !success) {
        try {
          const result = await callGemini(SYSTEM_PROMPT_GLOBAL, item.prompt);
          finalResults[item.key] = result;
          success = true;
        } catch (e) {
          const isRetryable =
            e.message.includes('429') ||
            e.message.includes('Quota') ||
            e.message.includes('503') ||
            e.message.includes('500') ||
            e.message.includes('PARSE_ERROR') ||
            e.message.includes('did not return');

          if (isRetryable) {
            retryCount++;
            const waitMs = 2000 * retryCount; // 2s, 4s, 6s, 8s, 10s, 12s
            console.log(`Retry ${retryCount}/6 untuk ${item.key} — tunggu ${waitMs}ms`);
            await delay(waitMs);
          } else {
            // Gagal permanen (misal 400 Bad Request)
            console.error(`Gagal permanen pada ${item.key}:`, e.message);
            finalResults[item.key] = { error: e.message };
            success = true;
          }
        }
      }

      if (!success) {
        finalResults[item.key] = { error: 'Gagal setelah 6x percobaan.' };
      }
    }

    return NextResponse.json(finalResults);
  } catch (error) {
    console.error('Error in /api/generate-lampiran:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan di server' },
      { status: 500 }
    );
  }
}
