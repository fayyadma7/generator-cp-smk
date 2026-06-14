import { NextResponse } from 'next/server';

// Route ini sudah tidak digunakan — digantikan oleh /api/generate-lampiran
export async function POST() {
  return NextResponse.json({ error: 'Endpoint ini sudah tidak aktif. Gunakan /api/generate-lampiran.' }, { status: 410 });
}
