import './globals.css';

export const metadata = {
  title: 'Generator CP - SMK Muh 3 Purbalingga',
  description: 'Aplikasi AI untuk membuat Format Capaian Pembelajaran SMK Muhammadiyah 3 Purbalingga',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
