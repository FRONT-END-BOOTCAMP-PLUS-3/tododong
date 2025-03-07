import { EventDto } from '@/application/usecases/game/play-by-play/dto/PlaybyplayDto';
import styles from './Timeline.module.scss';

type TimelineProps = {
  type?: string;
  event: EventDto;
};

// 경과된 시간 계산하는 함수 (12분 default 기준)
const formatClockToElapsedTime = (
  clock: string,
  timePerQuater: string = '12:00'
) => {
  const match = clock.match(/PT(\d+)M(\d+\.\d+)S/);
  if (!match) {
    throw new Error('Invalid duration format');
  }

  const currentMinute = parseInt(match[1], 10);
  const currentSecond = parseInt(match[2]);
  const [minutes, seconds] = timePerQuater.split(':').map(Number);

  const totalSeconds = minutes * 60 + seconds;
  const currentSeconds = currentMinute * 60 + currentSecond;

  const elapsedSeconds = totalSeconds - currentSeconds;
  const formattedMinutes = String(Math.floor(elapsedSeconds / 60)).padStart(
    2,
    '0'
  );
  const formattedSeconds = String(elapsedSeconds % 60).padStart(2, '0');

  return `${formattedMinutes} : ${formattedSeconds}`;
};

// 괄호 기준으로 문자열을 분리하는 함수
const formatDescription = (text: string) => {
  return text
    .split(/(\(.*?\))/)
    .map((item, index) => <span key={index}>{item}</span>);
};

const Timeline = ({ type, event }: TimelineProps) => {
  const isMadeShot = event.shotResult === 'Made';

  const points =
    isMadeShot && event.actionType === 'freethrow'
      ? '1 POINT'
      : `${parseInt(event.actionType)} POINT`;
  const score = isMadeShot ? `${event.scoreAway} - ${event.scoreHome}` : '';

  return (
    <tr className={styles.timeline}>
      <td className={`${styles.description} ${styles.away}`}>
        {type === 'away' && (
          <>
            {isMadeShot && <span className={styles.point}>{points}</span>}
            {formatDescription(event.description)}
          </>
        )}
      </td>

      <td className={styles.timeAndScore}>
        <span className={styles.time}>
          {formatClockToElapsedTime(event.clock)}
        </span>
        {isMadeShot && <span className={styles.score}>{score}</span>}
      </td>

      <td className={`${styles.description} ${styles.home}`}>
        {type === 'home' && (
          <>
            {isMadeShot && <span className={styles.point}>{points}</span>}
            {formatDescription(event.description)}
          </>
        )}
      </td>
    </tr>
  );
};

export default Timeline;
