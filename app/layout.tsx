import type { Metadata, Viewport } from 'next';
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-serif-tc',
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans-tc',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Linda Salon | 質感美學沙龍 — 線上預約',
  description:
    'Linda Salon 高端美學沙龍：專業髮型設計、美容護理與造型服務，立即線上預約您的專屬時光。',
};

export const viewport: Viewport = {
  themeColor: '#FDFBF7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className={`${notoSerifTC.variable} ${notoSansTC.variable}`}>
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
