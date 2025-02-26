import styles from './YoutubeVideoCard.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { VideoSnippet } from '@/application/usecases/game/videos/dto/videoDto';

type YoutubeVideoCardProps = {
  data: {
    id: { videoId: string };
    snippet: VideoSnippet;
    channelImage: string;
  };
};

const YoutubeVideoCard = ({ data }: YoutubeVideoCardProps) => {
  return (
    <article className={styles.videoCard}>
      <Link href={`https://www.youtube.com/watch?v=${data.id.videoId}`}>
        <Image
          src={data.snippet.thumbnails.medium.url}
          alt={data.snippet.title}
          width={200}
          height={112}
          className={styles.thumbnail}
          priority
        />
      </Link>
      <div className={styles.details}>
        <Link href={`https://www.youtube.com/watch?v=${data.id.videoId}`}>
          <h3 className={styles.title}>{data.snippet.title}</h3>
        </Link>
        <Link
          href={`https://www.youtube.com/channel/${data.snippet.channelId}`}
          className={styles.channel}
        >
          <Image
            src={data.channelImage}
            alt={data.snippet.channelTitle}
            width={16}
            height={16}
            className={styles.channelImage}
            priority
          />
          <p className={styles.channelTitle}>{data.snippet.channelTitle}</p>
        </Link>
      </div>
    </article>
  );
};

export default YoutubeVideoCard;
