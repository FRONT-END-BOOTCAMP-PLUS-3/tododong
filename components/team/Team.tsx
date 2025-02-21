import styles from './Team.module.scss';
import Image from 'next/image';

type TeamProps = { logoSrc: string; name: string };

const Team = ({ logoSrc, name }: TeamProps) => {
  return (
    <div className={styles.team}>
      <Image src={logoSrc} width={40} height={40} alt={`${name} 로고`} />
      <p>{name}</p>
    </div>
  );
};

export default Team;

/*
사용 예시
<Team logoSrc="https://" name="Atlanta Hawks" />
*/
