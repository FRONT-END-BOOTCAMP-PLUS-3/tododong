import styles from './Team.module.scss';
import Image from 'next/image';

type TeamProps = { logoSrc: string; name?: string; nickname?: string };

const Team = ({ logoSrc, name, nickname }: TeamProps) => {
  return (
    <div className={styles.team}>
      <Image
        src={logoSrc}
        width={40}
        height={40}
        alt={`${name || nickname} 로고`}
      />
      <p>{name || nickname}</p>
    </div>
  );
};

export default Team;

/*
사용 예시 1
<Team logoSrc="https://" name="Atlanta Hawks" />

사용 예시 2
<Team logoSrc="https://" nickname="Hawks" />
*/
