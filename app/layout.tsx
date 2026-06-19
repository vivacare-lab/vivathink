import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Baloo_2 } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { env } from '@/lib/env';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
const baloo = Baloo_2({ variable: '--font-baloo', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'vivathink — 창의력 질문 훈련소',
  description:
    '두 개의 단어로 호기심 가득한 질문을 만들고 AI 피드백과 점수를 받아보세요. 부모와 자녀가 함께하는 창의력 질문 훈련소.',
  generator: 'v0.app',
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      className={`light ${geistSans.variable} ${geistMono.variable} ${baloo.variable} bg-background`}
    >
      <body className='font-sans antialiased'>
        {children}
        <Toaster richColors position='top-center' />
        {env.nodeEnv === 'production' && <Analytics />}
      </body>
    </html>
  );
}
