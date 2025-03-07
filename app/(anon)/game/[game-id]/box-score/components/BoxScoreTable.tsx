'use client';

import { useEffect, useState } from 'react';
import styles from './BoxScoreTable.module.scss';
import Image from 'next/image';
import {
  StatisticsDto,
  TeamDto,
} from '@/application/usecases/game/box-score/dto/boxscoreDto';

// Box Score 테이블 헤더
const BOX_SCORE_TABLE_HEADER = [
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
  data: TeamDto;
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
  const [sortedData, setSortedData] = useState(data.players ?? []);

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
  const getSortedData = (data: StatisticsDto[], sortState: SortState) => {
    // 정렬 기준이 없는 경우 기존 데이터 반환
    if (sortState.key === null) return data;

    return [...data].sort((a, b) => {
      const aValue = Object.values(a)[sortState.key!] ?? 0;
      const bValue = Object.values(b)[sortState.key!] ?? 0;

      // 정렬 기준이 출전 시간일 경우 분, 초로 구분해서 정렬
      if (
        sortState.key === 2 &&
        BOX_SCORE_TABLE_HEADER[sortState.key] === '출전\n시간'
      ) {
        const [aMin, aSec] = aValue.split(':').map(Number);
        const [bMin, bSec] = bValue.split(':').map(Number);

        if (aMin !== bMin) {
          return sortState.descending ? bMin - aMin : aMin - bMin;
        }

        return sortState.descending ? bSec - aSec : aSec - bSec;
      }

      return sortState.descending
        ? Number(bValue) - Number(aValue)
        : Number(aValue) - Number(bValue);
    });
  };

  useEffect(() => {
    setSortedData(getSortedData(data.players, sortState));
  }, [data.players, sortState]);

  return (
    <section className={styles.boxScore}>
      {/* 팀 명 */}
      <div className={styles.teamTitle}>
        <span className="srOnly">{visitor ? '원정 팀' : '홈 팀'}</span>
        <Image
          src={data.logo}
          alt={`${data.name} 로고`}
          width={40}
          height={40}
        />
        <span>{`${data.city} ${data.name}`}</span>
      </div>
      {/* 기록 테이블 */}
      <div className={styles.table}>
        <table>
          {/* 헤더 */}
          <thead className={styles.tableHeader}>
            <tr>
              {BOX_SCORE_TABLE_HEADER.map((header, index) => {
                const isSelected = sortState.key === index;
                return (
                  <th
                    scope="col"
                    role="button"
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
            {sortedData.map((data) => {
              // const playerData = Object.entries(data)
              //   .filter(([key]) => key !== 'name')
              //   .map(([, item]) => item);
              const playerData = Object.keys(data)
                .filter((key) => key !== 'name')
                .map((key) => data[key as keyof StatisticsDto]);
              return (
                <tr key={data.name}>
                  <td>{data.name}</td>
                  {playerData.map((item, index) => (
                    <td key={index}>{item}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BoxScoreTable;
