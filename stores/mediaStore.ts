import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { create } from 'zustand';

const SM_MOBILE = { query: '(max-width: 480px)' };
const LG_MOBILE = { query: '(max-width: 768px)' };
const TABLET = { query: '(max-width: 1279px)' };

// 스토어 정의
export const useMediaStore = create<{
  media: 'smMobile' | 'lgMobile' | 'tablet' | 'desktop';
  setMedia: (value: 'smMobile' | 'lgMobile' | 'tablet' | 'desktop') => void;
}>((set) => ({
  media: 'desktop',
  setMedia: (value: 'smMobile' | 'lgMobile' | 'tablet' | 'desktop') =>
    set({ media: value }),
}));

// 화면 크기 감지 및 상태 업데이트
export const useMediaDetector = () => {
  const setMedia = useMediaStore((store) => store.setMedia);

  const smMobile = useMediaQuery(SM_MOBILE);
  const lgMobile = useMediaQuery(LG_MOBILE);
  const tablet = useMediaQuery(TABLET);
  const desktop = !tablet;

  useEffect(() => {
    if (smMobile) {
      setMedia('smMobile');
    } else if (lgMobile) {
      setMedia('lgMobile');
    } else if (tablet) {
      setMedia('tablet');
    } else {
      setMedia('desktop');
    }
  }, [smMobile, lgMobile, tablet, desktop, setMedia]);
};

/* 사용예시
const media = useMediaStore((state) => state.media);

return (
  {media === 'smMobile') ?
    <div>Small Mobile</div>
    : media === 'lgMobile' ?
      <div>Large Mobile</div>
    : media === 'tablet' ?
      <div>Tablet</div>
    : <div>Desktop</div>
  }
)
 */
