import { useCallback, useLayoutEffect, useRef } from 'react';

export default function useBodyScrollLock(isOpen: boolean) {
  const scrollYRef = useRef(0); // 스크롤 위치

  const lockScroll = useCallback(() => {
    scrollYRef.current = window.scrollY; // 현재 스크롤 위치 저장

    document.body.style.cssText = `
      position: fixed;
      top: -${scrollYRef.current}px;
      left: 50%;
      translate: -50% 0;
      width: 100%;
      overflow-y: scroll;
    `;
  }, []);

  useLayoutEffect(() => {
    if (isOpen) {
      lockScroll();

      return () => {
        document.body.style.cssText = '';
        window.scrollTo(0, scrollYRef.current);
      };
    }
  }, [isOpen, lockScroll]);

  return null;
}
