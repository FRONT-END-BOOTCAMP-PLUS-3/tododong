export type VideoSnippet = {
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnails: {
    medium: { url: string };
    default: { url: string };
  };
};

export type Video = {
  id: { videoId: string };
  snippet: VideoSnippet;
  channelImage: string;
};

type ChannelSnippet = {
  title: string;
  thumbnails: {
    default: { url: string };
  };
};

type Channel = {
  id: string;
  snippet: ChannelSnippet;
};

export type VideoData = {
  items: Video[];
  regionCode?: string;
};

export type ChannelData = {
  items: Channel[];
};
