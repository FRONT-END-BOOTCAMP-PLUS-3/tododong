import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')], // styles 폴더를 기본 경로로 설정
  },
};

export default nextConfig;
