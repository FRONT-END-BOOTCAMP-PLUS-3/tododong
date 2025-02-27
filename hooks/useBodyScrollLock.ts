import { useCallback, useLayoutEffect } from 'react';

export default function useBodyScrollLock(isOpen: boolean) {
  const lockScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  useLayoutEffect(() => {
    if (isOpen) {
      lockScroll();

      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, lockScroll]);

  return null;
}
