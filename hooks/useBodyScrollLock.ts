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
    if (isOpen) lockScroll();
    else {
      // 저장된 위치로 복귀
      window.scrollTo(0, scrollYRef.current);
    }

    return () => {
      // 언마운트 시 스크롤 잠금 해제
      document.body.style.cssText = '';
    };
  }, [isOpen, lockScroll]);

  return null;
}
