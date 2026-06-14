import { NextResponse } from 'next/server';
import { sectionPrompts, SECTION_LABELS } from '../../../lampiranPromptsHybrid';
import { generate, parseAIResult } from '../../../lib/aiClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request) {
  try {
    const body = await request.json();
    const { header, sectionKey, existingData, modulText } = body;

    if (!header || !sectionKey) {
      return NextResponse.json({ error: 'header dan sectionKey wajib diisi' }, { status: 400 });
    }

    const builder = sectionPrompts[sectionKey];
    if (!builder) {
      return NextResponse.json({ error: 'Unknown section: ' + sectionKey }, { status: 400 });
    }

    const label = SECTION_LABELS[sectionKey] || sectionKey;
    // builder(header, existingData, modulText)
    const prompts = builder(header, existingData || {}, modulText || '');

    // Panggil AI Client → failover: Gemini → NVIDIA → Groq
    let textOutput;
    try {
      const aiResult = await generate({
        system: prompts.system,
        user: prompts.user,
        jsonMode: true,
        model: 'gemini-2.5-flash',
      });
      console.log(`✅ [${sectionKey}] AI berhasil via ${aiResult.provider}`);
      textOutput = aiResult.text;
    } catch (err) {
      console.error(`AI Client gagal untuk [${sectionKey}]:`, err.message);
      return NextResponse.json({ error: err.message || 'AI tidak tersedia.' }, { status: 503 });
    }

    let result;
    try {
      result = parseAIResult(textOutput);
    } catch {
      return NextResponse.json({
        error: 'Gagal memproses data AI. Silakan coba lagi.',
      }, { status: 500 });
    }

    return NextResponse.json({
      sectionKey,
      label,
      data: result,
    });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
