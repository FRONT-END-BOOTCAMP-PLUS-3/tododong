'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  useLayoutEffect(() => {
    if (prevPathRef.current !== pathname) {
      if (window.history.scrollRestoration) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return null;
}
