// ── AI Client dengan failover: Gemini → NVIDIA → Groq ──
// Panggil aiClient.generate() dengan { system, user, jsonMode? }
// Dia akan coba provider satu per satu sampai sukses.

const PROVIDERS = [];

// ── Provider: Gemini ──
PROVIDERS.push({
  name: 'Gemini',
  isAvailable: () => {
    const keys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY
    ].filter(Boolean);
    return keys.length > 0;
  },
  call: async ({ system, user, jsonMode = true, model = 'gemini-2.5-flash' }) => {
    const keys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY
    ].filter(Boolean);

    if (keys.length === 0) throw new Error('NO_KEYS');

    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    let lastErr = null;

    for (let attempt = 0; attempt < Math.min(keys.length * 2, 6); attempt++) {
      const apiKey = keys[Math.floor(Math.random() * keys.length)];
      try {
        const body = {
          contents: [{ parts: [{ text: user }] }],
          generationConfig: {
            temperature: 0.4,
            ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
          }
        };
        if (system) body.systemInstruction = { parts: [{ text: system }] };

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          if (res.status === 429 || res.status >= 500) {
            lastErr = new Error(`RETRYABLE_${res.status}`);
            await delay(2000 * (attempt + 1));
            continue;
          }
          throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text || text.trim().length < 5) {
          lastErr = new Error('RETRYABLE_EMPTY');
          await delay(2000 * (attempt + 1));
          continue;
        }
        if (jsonMode) {
          try { JSON.parse(text); } catch { throw new Error('Gemini returned invalid JSON'); }
        }
        return { text, provider: 'gemini', raw: data };
      } catch (err) {
        if (err.message?.startsWith('RETRYABLE') || err.message?.includes('invalid JSON')) {
          lastErr = err;
          continue;
        }
        throw err;
      }
    }
    throw lastErr || new Error('Gemini gagal setelah semua percobaan');
  }
});

// ── Provider: NVIDIA ──
PROVIDERS.push({
  name: 'NVIDIA',
  isAvailable: () => !!process.env.NVIDIA_API_KEY,
  call: async ({ system, user, jsonMode = true }) => {
    const model = process.env.NVIDIA_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct';

    const messages = [];
    if (system) messages.push({ role: 'system', content: system });
    messages.push({ role: 'user', content: user });

    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 4096,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`NVIDIA ${res.status}: ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('NVIDIA returned empty response');

    return { text, provider: 'nvidia', raw: data };
  }
});

// ── Provider: Groq ──
PROVIDERS.push({
  name: 'Groq',
  isAvailable: () => !!process.env.GROQ_API_KEY,
  call: async ({ system, user, jsonMode = true }) => {
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

    const messages = [];
    if (system) messages.push({ role: 'system', content: system });
    messages.push({ role: 'user', content: user });

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 4096,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq ${res.status}: ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Groq returned empty response');

    return { text, provider: 'groq', raw: data };
  }
});

// ── Unified generate ──
export async function generate({ system, user, jsonMode = true, model }) {
  const errors = [];

  for (const provider of PROVIDERS) {
    if (!provider.isAvailable()) {
      console.log(`[aiClient] ${provider.name} SKIP (no key)`);
      continue;
    }
    try {
      console.log(`[aiClient] Trying ${provider.name}...`);
      const result = await provider.call({ system, user, jsonMode, model });
      console.log(`[aiClient] ${provider.name} SUCCESS`);
      return result;
    } catch (err) {
      console.warn(`[aiClient] ${provider.name} FAILED:`, err.message?.slice(0, 100));
      errors.push({ provider: provider.name, error: err.message });
      // Lanjut ke provider berikutnya
    }
  }

  // Semua gagal
  const detail = errors.map(e => `${e.provider}: ${e.error}`).join(' | ');
  throw new Error(`Semua AI provider gagal. ${detail}`);
}

// ── Utility: parse JSON dari hasil generate ──
export function parseAIResult(text) {
  if (!text) throw new Error('Empty AI response');
  // Bersihkan markdown code block jika ada
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return JSON.parse(cleaned);
}
