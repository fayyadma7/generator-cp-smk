import { NextResponse } from 'next/server';
import { sectionPrompts, SECTION_LABELS } from '../../../lampiranPromptsHybrid';

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

    // Gemini API key rotation
    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'API Key Gemini belum diatur' }, { status: 500 });
    }

    let retryCount = 0;
    let success = false;
    let textOutput = '';
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    while (retryCount < 5 && !success) {
      const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

      try {
        console.log(`Generate ${sectionKey} attempt ${retryCount + 1}...`);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: prompts.system }] },
              contents: [{ parts: [{ text: prompts.user }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.4,
                maxOutputTokens: 2048,
              }
            })
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Gemini Error [${sectionKey}] attempt ${retryCount + 1}:`, response.status, errorText.slice(0, 150));
          if (response.status === 429 || response.status >= 500) {
            throw new Error('RETRYABLE_' + response.status);
          }
          return NextResponse.json({
            error: `Gagal menghubungi AI (${response.status})`,
          }, { status: response.status });
        }

        const aiData = await response.json();
        textOutput = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textOutput || textOutput.trim().length < 10) {
          throw new Error('RETRYABLE_EMPTY');
        }

        // Validate JSON
        JSON.parse(textOutput);
        success = true;
      } catch (err) {
        if (err.message && err.message.startsWith('RETRYABLE')) {
          retryCount++;
          if (retryCount >= 5) {
            return NextResponse.json({
              error: 'Batas percobaan API tercapai. Silakan coba lagi.',
            }, { status: 429 });
          }
          await delay(3000 * retryCount);
        } else {
          console.error(`Fatal error generating ${sectionKey}:`, err);
          return NextResponse.json({
            error: 'Gagal memproses respons AI: ' + (err.message || 'Unknown error'),
          }, { status: 500 });
        }
      }
    }

    if (!textOutput) {
      return NextResponse.json({ error: 'AI tidak mengembalikan data valid.' }, { status: 500 });
    }

    const result = JSON.parse(textOutput);

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
