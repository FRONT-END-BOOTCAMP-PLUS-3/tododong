import '@/styles/globals.scss';
import styles from './layout.module.scss';

export const metadata = {
  title: '토도동',
  description: '농구 경기 일정, 실시간 중계를 제공',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko-KR">
      <body>{children}</body>
    </html>
  );
}
