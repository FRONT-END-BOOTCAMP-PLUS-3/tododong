import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')], // styles 폴더를 기본 경로로 설정
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // intro page 아직 없어서 설정
  async redirects() {
    return [
      {
        source: '/',
        destination: '/schedule',
        permanent: false, // true로 설정 시 다른 브라우저 캐시 때문에 다른 프로젝트에서도 리다이렉션 되는 문제 발생
      },
    ];
  },
};

export default nextConfig;
