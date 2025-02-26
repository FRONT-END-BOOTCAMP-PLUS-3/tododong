import { EventDto } from '../mockDataDto';
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
  const [minutes, seconds] = timePerQuater.split(':').map(Number);
  const [currentMinute, currentSecond] = clock.split(':').map(Number);

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
  const isMadeShot = event.statistics?.find(
    (item) => item.type === 'fieldgoal' || item.type === 'freethrow'
  )?.made;
  const points = isMadeShot
    ? `${
        event.statistics?.length
          ? event.statistics.find(
              (item) => item.type === 'fieldgoal' || item.type === 'freethrow'
            )?.points
          : 0
      } POINT`
    : '';
  const score = isMadeShot ? `${event.away_points} - ${event.home_points}` : '';

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
