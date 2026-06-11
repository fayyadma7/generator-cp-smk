import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { subject, phase, cpText } = await request.json();

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
    }

    const prompt = `Tugas Anda adalah merumuskan analisis dan rekomendasi pembelajaran untuk CP SMK Muhammadiyah 3 Purbalingga.
Mata Pelajaran: ${subject}
Fase: ${phase}
Teks CP Asli: ${cpText}

Output HANYA dalam bentuk JSON persis seperti struktur berikut tanpa tambahan karakter markdown (\`\`\`json):
{
  "analisis": {
    "kompetensiInti": "Sebutkan Pengetahuan, Keterampilan, dan Sikap secara singkat.",
    "koneksiIndustri": "Jelaskan relevansi CP dengan industri.",
    "koneksiLokal": "Jelaskan keterkaitan CP dengan potensi lokal Purbalingga."
  },
  "dimensiProfil": {
    "dimensi1": "Penjelasan keterkaitan dengan Keimanan & Ketakwaan... isi dengan string kosong jika tidak relevan.",
    "dimensi2": "Penjelasan...",
    "dimensi3": "Penjelasan...",
    "dimensi4": "Penjelasan...",
    "dimensi5": "Penjelasan...",
    "dimensi6": "Penjelasan...",
    "dimensi7": "Penjelasan...",
    "dimensi8": "Penjelasan..."
  },
  "deepLearning": {
    "mindful": "Uraikan aktivitas mindful...",
    "meaningful": "Uraikan pembelajaran bermakna...",
    "joyful": "Uraikan strategi joyful..."
  },
  "strategi": {
    "model": "Contoh: PBL, PjBL...",
    "asesmen": "Contoh: Formatif...",
    "media": "Buku, video...",
    "alat": "Komputer, software..."
  }
}
`;

    const response = await fetch(`https://text.pollinations.ai/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Anda adalah asisten AI khusus pembuat JSON. Dilarang keras membalas dengan teks apa pun selain raw JSON. Pastikan JSON yang dihasilkan 100% valid dan bisa di parse.' },
          { role: 'user', content: prompt }
        ],
        jsonMode: true,
        model: 'openai'
      })
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Gagal menghubungi server Pollinations AI' }, { status: 500 });
    }

    let textOutput = await response.text();
    
    // Membersihkan teks jika ada backtick markdown ```json
    textOutput = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const result = JSON.parse(textOutput);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server saat mem-parsing JSON' }, { status: 500 });
  }
}
