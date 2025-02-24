'use client';

import styles from './page.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface VideoSnippet {
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnails: {
    medium: { url: string };
    default: { url: string };
  };
}

interface Video {
  id: { videoId: string };
  snippet: VideoSnippet;
  channelImage: string;
}

interface ChannelSnippet {
  title: string;
  thumbnails: {
    default: { url: string };
  };
}

interface ChannelData {
  id: string;
  snippet: ChannelSnippet;
}

const Videos = () => {
  // YouTube API를 사용하여 동영상 데이터를 가져오는 함수 (Usecase로 이동 예정)
  const fetchYouTubeVideos = async (
    query: string,
    nextPageToken: string | null = null
  ) => {
    const API_KEY = 'AIzaSyBkTiPtPO6rlSiu9n5HM4cyqxzGq2jA7Cs'; // 환경 변수
    const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
    const CHANNELS_URL = 'https://www.googleapis.com/youtube/v3/channels';

    try {
      //  비디오 데이터
      const videoRes = await fetch(
        `${BASE_URL}?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=16&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
      );

      if (!videoRes.ok) throw new Error('YouTube API 호출 실패');

      const videoData = await videoRes.json();
      const videos: Video[] = videoData.items;

      // 비디오 데이터에서 채널 ID 추출
      const channelIds = [
        ...new Set(videos.map((video) => video.snippet.channelId)),
      ];

      // 채널 데이터
      const channelRes = await fetch(
        `${CHANNELS_URL}?part=snippet&id=${channelIds.join(',')}&key=${API_KEY}`
      );
      if (!channelRes.ok) throw new Error('채널 정보 호출 실패');

      const channelData = await channelRes.json();
      const channelImage: { [key: string]: string } = {};

      channelData.items.forEach((channel: ChannelData) => {
        channelImage[channel.id] = channel.snippet.thumbnails.default.url;
      });

      // 비디오 데이터 + 채널 이미지 데이터 합치기
      return {
        videos: videos.map((video) => ({
          ...video,
          channelImage: channelImage[video.snippet.channelId] || '',
        })),
        nextPageToken: videoData.nextPageToken,
      };
    } catch (error) {
      console.error('Error fetching YouTube:', error);
      return { videos: [], nextPageToken: null };
    }
  };

  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const query = 'NBA highlights';

  useEffect(() => {
    const fetchVideos = async () => {
      const { videos: initialVideos, nextPageToken: token } =
        await fetchYouTubeVideos(query);
      setVideos(initialVideos);
      setNextPageToken(token);
    };

    fetchVideos();
  }, [query]);

  // 추가 동영상 데이터를 불러오는 함수
  const getMoreVideos = useCallback(async () => {
    if (isLoading || !nextPageToken) return;

    setIsLoading(true);
    const { videos: newVideos, nextPageToken: newToken } =
      await fetchYouTubeVideos(query, nextPageToken);

    // setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    // 중복 동영상 필터링
    setVideos((prevVideos) => {
      const existingVideoIds = new Set(
        prevVideos.map((video) => video.id.videoId)
      );
      const filteredNewVideos = newVideos.filter(
        (video) => !existingVideoIds.has(video.id.videoId)
      );

      return [...prevVideos, ...filteredNewVideos];
    });
    setNextPageToken(newToken);
    setIsLoading(false);
  }, [isLoading, nextPageToken, query]);

  // 스크롤을 감지하여 추가 데이터를 불러오는 함수
  const observer = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (node) {
        const options = {
          root: null,
          rootMargin: '20px',
          threshold: 1.0,
        };
        const observer = new IntersectionObserver(([entry]) => {
          // 요소가 화면에 보일 때 추가 데이터를 불러옴
          if (entry.isIntersecting) {
            getMoreVideos();
          }
        }, options);
        observer.observe(node);
      }
    },
    // isLoading이나 loadMoreVideos가 변경될 때마다 observer 함수 재생성 방지
    [isLoading, getMoreVideos]
  );

  // const gameStatus = 'hi';

  // if (gameStatus !== 'final') {
  //   return (
  //     <section>
  //       <h2 className="srOnly">{`${query} 동영상`}</h2>
  //       <div className={styles.gameStatus}>경기 종료 후 업데이트 됩니다.</div>
  //     </section>
  //   );
  // }

  return (
    <section>
      <h2 className="srOnly">{`${query} 동영상`}</h2>
      <ul className={styles.videoCardContainer}>
        {videos.map((video) => (
          <li key={video.id.videoId} className={styles.videoCard}>
            <Link href={`https://www.youtube.com/watch?v=${video.id.videoId}`}>
              <Image
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                width={200}
                height={112}
                className={styles.thumbnail}
                priority
              />
            </Link>
            <div className={styles.details}>
              <Link
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              >
                <h3 className={styles.title}>{video.snippet.title}</h3>
              </Link>
              <Link
                href={`https://www.youtube.com/channel/${video.snippet.channelId}`}
                className={styles.channel}
              >
                <Image
                  src={video.channelImage}
                  alt={video.snippet.channelTitle}
                  width={16}
                  height={16}
                  className={styles.channelImage}
                  priority
                />
                <p className={styles.channelTitle}>
                  {video.snippet.channelTitle}
                </p>
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div ref={observer} />
      {isLoading && <p>로딩 중...</p>}
    </section>
  );
};

export default Videos;
