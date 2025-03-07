import styles from './Loader.module.scss';
import Image from 'next/image';

type LoaderProps = {
  className?: string;
  size?: number;
};

const Loader = ({ className, size }: LoaderProps) => {
  return (
    <div className={`${styles.loader} ${className}`}>
      <Image
        src="/loader.png"
        className={styles.spinner}
        width={size || 52}
        height={size || 52}
        alt="로딩 이미지"
      />
    </div>
  );
};

export default Loader;

/*
사용 예시 1: (width), height 지정
<Loader className={styles.loader} />

사용 예시 2: 농구공 크기 조정 필요할 때
<Loader className={styles.loader} size={20}/>
*/
