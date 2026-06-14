'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LampiranGeneratorRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/lampiran');
  }, [router]);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
      Mengarahkan ke halaman Lampiran...
    </div>
  );
}
