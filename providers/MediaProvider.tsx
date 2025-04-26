'use client';

import { useMediaDetector } from '@/stores/mediaStore';

const MediaProvider = () => {
  useMediaDetector(); // 클라이언트 환경에서 실행

  return null;
};

export default MediaProvider;
