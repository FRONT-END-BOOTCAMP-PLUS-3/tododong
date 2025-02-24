'use client';

import { useEffect, useState } from 'react';
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

type BoxScoreData = {
  player: {
    firstname: string;
    lastname: string;
  };
  records: {
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
};

type BoxScoreTable = {
  data: {
    name: string;
    nickname: string;
    code: string;
    logo: string;
    boxScore: BoxScoreData[];
  };
  visitor: boolean;
};

type SortState = {
  key: number | null;
  descending: boolean | null;
};

const BoxScoreTable = ({ data, visitor }: BoxScoreTable) => {
  const [sortState, setSortState] = useState<SortState>({
    key: null,
    descending: true,
  });
  const [sortedData, setSortedData] = useState(data.boxScore ?? []);

  // 정렬 기준을 저장하는 함수
  const handleSortState = (index: number) => {
    // 선수명 기준으로는 정렬하지 않음
    if (index === 0) return;

    setSortState((prev) => ({
      key: index,
      descending: prev.key === index ? !prev.descending : true,
    }));
  };

  // 정렬된 데이터를 반환하는 함수
  const getSortedData = (data: BoxScoreData[], sortState: SortState) => {
    // 정렬 기준이 없는 경우 기존 데이터 반환
    if (sortState.key === null) return data;

    // 값을 숫자로 변환 후 정렬
    return [...data].sort((a, b) => {
      const aValue = Number(Object.values(a.records)[sortState.key! - 1]);
      const bValue = Number(Object.values(b.records)[sortState.key! - 1]);

      return sortState.descending ? bValue - aValue : aValue - bValue;
    });
  };

  useEffect(() => {
    setSortedData(getSortedData(data.boxScore, sortState));
  }, [data.boxScore, sortState]);

  return (
    <section className={styles.boxScore}>
      {/* 팀 명 */}
      <div className={styles.teamTitle}>
        <Image
          src={data.logo}
          alt={`${data.name} 로고`}
          width={40}
          height={40}
        />
        <span className="srOnly">{visitor ? '원정 팀' : '홈 팀'}</span>
        <span>{data.name}</span>
      </div>
      {/* 기록 테이블 */}
      <div className={styles.table}>
        <table>
          {/* 헤더 */}
          <thead className={styles.tableHeader}>
            <tr>
              {BOXSCORETABLEHEADER.map((header, index) => {
                const isSelected = sortState.key === index;
                return (
                  <th
                    key={header}
                    className={isSelected ? styles.isSelected : ''}
                    onClick={() => handleSortState(index)}
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
                {Object.values(data.records).map((item, idx) => (
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
