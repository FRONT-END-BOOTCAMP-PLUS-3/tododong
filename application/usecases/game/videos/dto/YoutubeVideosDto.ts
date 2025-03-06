import { GameDto } from './GameDto';

export interface YoutubeVideoSnippet {
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnails: {
    medium: { url: string };
    default: { url: string };
  };
}

export interface YoutubeVideoDto {
  id: { videoId: string };
  snippet: YoutubeVideoSnippet;
  channelImage: string;
}

interface ChannelSnippet {
  title: string;
  thumbnails: {
    default: { url: string };
  };
}

export interface YoutubeChannel {
  id: string;
  snippet: ChannelSnippet;
}

export interface YoutubeVideosWithChannelDto {
  game: GameDto;
  videos: YoutubeVideoDto[] | null;
}
