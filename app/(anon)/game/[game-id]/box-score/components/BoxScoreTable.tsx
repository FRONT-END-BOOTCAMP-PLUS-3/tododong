import styles from './BoxScoreTable.module.scss';
import Image from 'next/image';

// Box Score 테이블 헤더
const BOXSCORETABLEHEADER = [
  '선수명',
  '득점',
  '출전\n시간',
  '야투\n성공',
  '야투\n시도',
  '야투%',
  '자유투\n성공',
  '자유투\n시도',
  '자유투%',
  '3점슛\n성공',
  '3점슛\n시도',
  '3점슛%',
  '공격\n리바운드',
  '수비\n리바운드',
  '리바운드',
  '어시스트',
  '파울',
  '스틸',
  '실책',
  '블락',
  '+/-',
];

type BoxScoreTable = {
  teamData: {
    name: string;
    logo: string;
  };
  sortedData: {
    player: {
      firstname: string;
      lastname: string;
    };
    boxScore: {
      points: number;
      min: string;
      fgm: number;
      fga: number;
      fgp: string;
      ftm: number;
      fta: number;
      ftp: string;
      tpm: number;
      tpa: number;
      tpp: string;
      offReb: number;
      defReb: number;
      totReb: number;
      assists: number;
      pFouls: number;
      steals: number;
      turnovers: number;
      blocks: number;
      plusMinus: string;
    };
  }[];
  onClick: (key: number, visitor: boolean) => void;
  visitor: boolean;
  selectedIndex: number | null;
};

const BoxScoreTable = ({
  teamData,
  sortedData,
  visitor,
  selectedIndex,
  onClick,
}: BoxScoreTable) => {
  return (
    <section className={styles.boxScore}>
      {/* 팀 명 */}
      <div className={styles.teamTitle}>
        <Image
          src={teamData.logo}
          alt={`${teamData.name} 로고`}
          width={40}
          height={40}
        />
        <span className="srOnly">{visitor ? '원정 팀' : '홈 팀'}</span>
        <span>{teamData.name}</span>
      </div>
      {/* 기록 테이블 */}
      <div className={styles.table}>
        <table>
          {/* 헤더 */}
          <thead className={styles.tableHeader}>
            <tr>
              {BOXSCORETABLEHEADER.map((header, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <th
                    key={header}
                    className={isSelected ? styles.isSelected : ''}
                    onClick={() => onClick(index, visitor)}
                  >
                    {header}
                  </th>
                );
              })}
            </tr>
          </thead>
          {/* 기록 데이터 */}
          <tbody className={styles.tableBody}>
            {sortedData.map((data, index) => (
              <tr key={index}>
                <td>{`${data.player.firstname} ${data.player.lastname}`}</td>
                {Object.values(data.boxScore).map((item, idx) => (
                  <td key={idx}>{item}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BoxScoreTable;
