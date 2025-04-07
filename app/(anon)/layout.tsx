import '@/styles/globals.scss';
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

  const hideLayoutRoutes = ['/login', '/signup'];

  return hideLayoutRoutes.includes(headerPathname) ? (
    <>{children}</>
  ) : (
    <>
      <Header pathname={headerPathname} />
      {children}
      <Footer pathname={headerPathname} />
    </>
  );
}
