'use client';

import styles from './page.module.scss';
import YoutubeVideoCard from './components/YoutubeVideoCard';
import { fetcher } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChannelData,
  Video,
  VideoData,
} from '@/application/usecases/game/videos/dto/videoDto';

type GameDataDto = {
  game: { id: string; status: string; date: string };
  home: {
    name: string;
  };
  away: { name: string };
};

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [countVideos, setCountVideos] = useState<number>(12);
  const [gameData, setGameData] = useState<GameDataDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pathname = usePathname();
  const gameId = pathname.split('/')[2];

  // 랜더링될 때 url의 [game-id] params로 게임 데이터 불러오기
  useEffect(() => {
    if (!gameId) return;

    const fetchGameData = async () => {
      try {
        const response = await fetcher<GameDataDto>(
          `/api/game/${gameId}/videos`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gameId,
            }),
          },
          setIsLoading
        );
        setGameData(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGameData();
  }, [gameId]);

  // 동영상 데이터를 불러오는 함수
  const fetchYoutubeVideos = async (query: string) => {
    try {
      const videoData = await fetcher<VideoData>(
        `${process.env.NEXT_PUBLIC_YOUTUBE_SEARCH_URL}?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=48&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        undefined,
        setIsLoading
      );
      const videos = videoData.items;

      // 채널 ID 추출 후 채널 썸네일 가져오기
      const channelIds = [
        ...new Set(videos.map((video) => video.snippet.channelId)),
      ];
      const channelData = await fetcher<ChannelData>(
        `${process.env.NEXT_PUBLIC_YOUTUBE_CHANNELS_URL}?part=snippet&id=${channelIds.join(',')}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
      const channelImage: { [key: string]: string } = {};
      channelData.items.forEach((channel) => {
        channelImage[channel.id] = channel.snippet.thumbnails.default.url;
      });

      // 비디오 데이터와 채널 썸네일 데이터 합치기
      return videos.map((video) => ({
        ...video,
        channelImage: channelImage[video.snippet.channelId] || '',
      }));
    } catch (error) {
      console.error(error);

      return [];
    }
  };

  // 게임 데이터가 있고, 게임 상태가 'final'일 때 동영상 불러오기
  useEffect(() => {
    if (!gameData || gameData.game.status !== 'final') return;

    const query = `${gameData.home.name} ${gameData.away.name} highlights`;

    const fetchVideos = async () => {
      const videos = await fetchYoutubeVideos(query);
      setVideos(videos);
    };

    fetchVideos();
  }, [gameData]);

  // 동영상을 추가로 렌더링하는 함수
  const displayMoreVideos = useCallback(() => {
    setCountVideos((prev) => Math.min(prev + 8, videos.length));
  }, [videos.length]);

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

  return (
    <section>
      <h2 className="srOnly">{`${gameData?.game.date} ${gameData?.home.name} vs ${gameData?.away.name} 동영상`}</h2>
      {gameData?.game.status !== 'final' ? (
        <div className={styles.statusInfo}>
          <p>경기 종료 후 업데이트 됩니다.</p>
        </div>
      ) : videos.length === 0 ? (
        <div className={styles.statusInfo}>
          <p>추후 업데이트 예정입니다.</p>
        </div>
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
