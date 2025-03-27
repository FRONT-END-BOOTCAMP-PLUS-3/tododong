'use client';

import { fetcher } from '@/utils';
import { useCallback, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { YoutubeVideosWithChannelDto } from '@/application/usecases/game/videos/dto/YoutubeVideosDto';
import { useQuery } from '@tanstack/react-query';
import styles from './page.module.scss';
import YoutubeVideoCard from './components/YoutubeVideoCard';
import Loader from '@/components/loader/Loader';

const fetchYoutubeVideos = async (gameId: string | string[]) => {
  const id = Array.isArray(gameId) ? gameId[0] : gameId;

  return fetcher<YoutubeVideosWithChannelDto>(`/api/game/${id}/videos`);
};

const Videos = () => {
  const [countVideos, setCountVideos] = useState<number>(12);

  const params = useParams();
  const gameId = params['game-id'];

  const { data, isLoading, error } = useQuery({
    queryKey: ['youtubeVideos', gameId],
    queryFn: () => fetchYoutubeVideos(gameId!),
    staleTime: 3600000,
    enabled: !!gameId, // gameId가 있을 때만 요청 실행
  });

  const videos = data?.videos;
  const gameData = data?.game;

  // 동영상을 추가로 렌더링하는 함수
  const displayMoreVideos = useCallback(() => {
    if (!videos) return null;

    setCountVideos((prev) => Math.min(prev + 8, videos.length));
  }, [videos]);

  // 마지막 동영상이 보일 때 추가로 동영상 렌더링
  const observer = useRef<IntersectionObserver | null>(null);
  const refLastVideo = useCallback(
    (node: HTMLLIElement) => {
      if (isLoading || !node) return;

      // 이전 옵저버를 해제하고 새로운 옵저버를 생성
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            displayMoreVideos();
          }
        },
        { threshold: 0.5 }
      );
      observer.current.observe(node);
    },
    [isLoading, displayMoreVideos]
  );

  if (isLoading) return <Loader />;
  if (!videos || !gameData || error)
    return <p className={styles.statusInfo}>추후 업데이트 예정입니다.</p>;

  return (
    <section>
      <h2 className="srOnly">{gameData.query}</h2>
      {gameData.status !== 'final' ? (
        <p className={styles.statusInfo}>경기 종료 후 업데이트 됩니다.</p>
      ) : (
        <ul className={styles.videoContainer}>
          {videos.slice(0, countVideos).map((video, index) => (
            <li
              key={video.id.videoId}
              ref={index === countVideos - 1 ? refLastVideo : null}
            >
              <YoutubeVideoCard data={video} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Videos;
