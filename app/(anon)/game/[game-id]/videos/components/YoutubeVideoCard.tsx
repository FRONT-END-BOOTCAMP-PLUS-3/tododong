import styles from './YoutubeVideoCard.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { YoutubeVideoSnippet } from '@/application/usecases/game/videos/dto/YoutubeVideosDto';
import { decodeText } from '@/utils/decodeText';

type YoutubeVideoCardProps = {
  data: {
    id: { videoId: string };
    snippet: YoutubeVideoSnippet;
    channelImage: string;
  };
};

const YoutubeVideoCard = ({ data }: YoutubeVideoCardProps) => {
  return (
    <article className={styles.videoCard}>
      <Link href={`https://www.youtube.com/watch?v=${data.id.videoId}`}>
        <div className={styles.thumbnailWrapper}>
          <Image
            className={styles.thumbnail}
            src={data.snippet.thumbnails.medium.url}
            alt={data.snippet.title}
            sizes="(max-width:767) 45vw, (max-width:1279) 30vw, 20vw"
            fill={true}
            priority
          />
        </div>
      </Link>
      <div className={styles.details}>
        <Link href={`https://www.youtube.com/watch?v=${data.id.videoId}`}>
          <h3 className={styles.title}>{decodeText(data.snippet.title)}</h3>
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
