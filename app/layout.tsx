import '@/styles/globals.scss';
// import styles from './layout.module.scss';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { headers } from 'next/headers';

export const metadata = {
  title: '토도동',
  description:
    'NBA 경기 일정, 경기별 Youtube영상, 선수 기록, 실시간 중계를 제공합니다.',
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      {
        url: '/favicons/favicon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
    ],
  },
  link: [
    {
      rel: 'stylesheet',
      as: 'style',
      crossOrigin: 'anonymous',
      href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css',
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const headerPathname = headersList.get('x-pathname') || '';

  return (
    <html lang="ko-KR">
      <body>
        <Header pathname={headerPathname} />
        {children}
        <Footer pathname={headerPathname} />

        <div id="loading-start" aria-live="assertive"></div>
        <div id="loading-end" aria-live="assertive"></div>
      </body>
    </html>
  );
}
