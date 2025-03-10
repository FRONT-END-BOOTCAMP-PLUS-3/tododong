import {
  YoutubeChannel,
  YoutubeVideoDto,
  YoutubeVideosWithChannelDto,
} from './dto/YoutubeVideosDto';
import { GameRepository } from '@/domain/repositories/GameRepository';
import { TeamRepository } from '@/domain/repositories/TeamRepository';

export const getYoutubeVideosUsecase = async (
  gameId: string,
  gameRepository: GameRepository,
  teamRepository: TeamRepository
): Promise<YoutubeVideosWithChannelDto> => {
  const game = await gameRepository.findById(gameId);
  if (!game) {
    throw new Error(`게임(${gameId}) 정보가 없습니다.`);
  }

  if (game.status !== 'final') return { game, videos: null };

  const homeTeam = await teamRepository.findById(game.awayTeamId);
  const awayTeam = await teamRepository.findById(game.homeTeamId);
  if (!homeTeam || !awayTeam) {
    throw new Error(`게임(${gameId}) 정보가 없습니다.`);
  }

  const query = `${homeTeam.name} ${awayTeam.name} 하이라이트`;

  const resVideo = await fetch(
    `${process.env.NEXT_PUBLIC_YOUTUBE_SEARCH_URL}?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=48&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
  );
  const videoData = await resVideo.json();
  if (videoData.items.length === 0) return { game, videos: null };

  const videos = videoData.items;

  // 채널 ID 추출 후 채널 썸네일 가져오기
  const channelIds = [
    ...new Set(videos.map((video: YoutubeVideoDto) => video.snippet.channelId)),
  ];
  const resChannel = await fetch(
    `${process.env.NEXT_PUBLIC_YOUTUBE_CHANNELS_URL}?part=snippet&id=${channelIds.join(',')}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
  );

  const channelData = await resChannel.json();
  const channelImage: { [key: string]: string } = {};
  channelData.items.forEach((channel: YoutubeChannel) => {
    channelImage[channel.id] = channel.snippet.thumbnails.default.url;
  });

  // 비디오 데이터와 채널 썸네일 데이터 합치기
  const videosWithChannel = videos.map((video: YoutubeVideoDto) => ({
    ...video,
    channelImage: channelImage[video.snippet.channelId] || '',
  }));

  return {
    game: { ...game, query },
    videos: videosWithChannel,
  };
};
