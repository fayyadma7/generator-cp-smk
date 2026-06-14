import { NextResponse } from 'next/server';
import { buildCPPrompt } from '../../../cpGenerator';
import { buildSystemPrompt as buildInsersiSystemPrompt } from '../../../cp_insersi_perkoperasian_prompt';
import { generate, parseAIResult } from '../../../lib/aiClient';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    const { subject, program, phase, cpText, grade, semester, year, time, teacher } = data;

    if (!cpText) {
      return NextResponse.json({ error: 'Teks CP tidak boleh kosong' }, { status: 400 });
    }

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

    // Panggil AI Client → failover otomatis: Gemini → NVIDIA → Groq
    let result;
    try {
      const aiResult = await generate({
        system: systemPrompt,
        user: finalUserPrompt,
        jsonMode: true,
        model: 'gemini-2.5-flash',
      });
      console.log(`✅ AI berhasil via ${aiResult.provider}`);
      result = parseAIResult(aiResult.text);
    } catch (err) {
      console.error('AI Client semua gagal:', err.message);
      return NextResponse.json({ error: err.message || 'Semua AI provider tidak tersedia.' }, { status: 503 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
