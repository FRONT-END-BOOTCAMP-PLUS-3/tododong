import '@/styles/globals.scss';
// import styles from './layout.module.scss';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { headers } from 'next/headers';

export default async function AnonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const headerPathname = headersList.get('x-pathname') || '';

  return (
    <>
      <Header pathname={headerPathname} />
      {children}
      <Footer pathname={headerPathname} />

      <div id="loading-start" aria-live="assertive"></div>
      <div id="loading-end" aria-live="assertive"></div>
    </>
  );
}
