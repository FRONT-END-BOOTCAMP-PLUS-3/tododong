'use client';

import styles from './page.module.scss';
import YoutubeVideoCard from './components/YoutubeVideoCard';
import { fetcher } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
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
  const [videos, setVideos] = useState<Video[] | null>([]);
  const [countVideos, setCountVideos] = useState<number>(12);
  const [gameData, setGameData] = useState<GameDataDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const params = useParams();
  const gameId = params['game-id'];

  // 게임 데이터 불러오는 함수
  const fetchGameData = useCallback(async (id: string) => {
    try {
      const gameData = await fetcher<GameDataDto>(
        `/api/game/${id}/videos`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        setIsLoading
      );

      return gameData;
    } catch (error) {
      console.error(error);
    }
  }, []);

  // 동영상 데이터를 불러오는 함수
  const fetchYoutubeVideos = async (query: string) => {
    try {
      const videoData = await fetcher<VideoData>(
        `${process.env.NEXT_PUBLIC_YOUTUBE_SEARCH_URL}?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=48&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        {},
        setIsLoading
      );

      if (videoData.items.length === 0) return null;

      const videos = videoData.items;

      // 채널 ID 추출 후 채널 썸네일 가져오기
      const channelIds = [
        ...new Set(videos.map((video) => video.snippet.channelId)),
      ];
      const channelData = await fetcher<ChannelData>(
        `${process.env.NEXT_PUBLIC_YOUTUBE_CHANNELS_URL}?part=snippet&id=${channelIds.join(',')}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        {},
        setIsLoading
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

      return null;
    }
  };

  useEffect(() => {
    if (!gameId) return;

    const fetch = async () => {
      const gameData = await fetchGameData(gameId);
      setGameData(gameData);

      // 게임 상태가 'final'일 때 동영상 불러오기
      if (gameData.game.status !== 'final') return;

      const query = `${gameData.home.name} ${gameData.away.name} 하이라이트`;
      const videos = await fetchYoutubeVideos(query);
      setVideos(videos);
    };

    fetch();
  }, [gameId, fetchGameData]);

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

  if (isLoading) return <div style={{ textAlign: 'center' }}>로딩중...</div>;
  if (!videos)
    return <p className={styles.statusInfo}>추후 업데이트 예정입니다.</p>;

  return (
    <section>
      <h2 className="srOnly">{`${gameData.game.date} ${gameData.home.name} vs ${gameData.away.name} 동영상`}</h2>
      {gameData?.game.status !== 'final' ? (
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
