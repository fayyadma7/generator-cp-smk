import './globals.css';

export const metadata = {
  title: 'Generator CP - SMK Muh 3 Purbalingga',
  description: 'Aplikasi AI untuk membuat Format Capaian Pembelajaran SMK Muhammadiyah 3 Purbalingga',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">Format AI Generator</div>
            <div className="nav-links">
              <a href="/" className="nav-link">Generator CP</a>
              <a href="/tp-atp" className="nav-link">Generator TP & ATP</a>
              <a href="/modul-ajar" className="nav-link">Generator Modul Ajar</a>
              <a href="/lampiran" className="nav-link">Generator Lampiran</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
