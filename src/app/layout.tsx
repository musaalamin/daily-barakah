import './globals.css';
import type { Metadata } from 'next';
import { Inter, Amiri } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const amiri = Amiri({ 
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

export const metadata: Metadata = {
  title: 'Daily Barakah',
  description: 'Your Daily Islamic Companion',
  manifest: '/manifest.json', // <--- IMPORTANT: Link to Manifest
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#1B4332',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* bg-black added here to prevent white flash */}
      <body className={`${inter.className} ${amiri.variable} bg-black`}>
        {children}
      </body>
    </html>
  );
}