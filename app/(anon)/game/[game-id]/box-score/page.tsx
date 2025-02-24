'use client';

import styles from './page.module.scss';
import BoxScoreTable from './components/BoxScoreTable';
import { useState } from 'react';

type SortState = {
  key: number | null;
  descending: boolean | null;
};

const BoxScore = () => {
  const [homeSortState, setHomeSortState] = useState<SortState>({
    key: null,
    descending: true,
  });

  const [awaySortState, setAwaySortState] = useState<SortState>({
    key: null,
    descending: true,
  });

  const dto = {
    game: { id: '14902', status: 'scheduled' },
    home: {
      name: 'Indiana Pacers',
      nickname: 'Pacers',
      code: 'IND',
      logo: 'https:\/\/upload.wikimedia.org\/wikipedia\/fr\/thumb\/c\/cf\/Pacers_de_l%27Indiana_logo.svg\/1180px-Pacers_de_l%27Indiana_logo.svg.png',
      data: [
        {
          player: { firstname: 'A', lastname: 'Siakam' },
          boxScore: {
            points: 10,
            min: '5',
            fgm: 3,
            fga: 8,
            fgp: '37.5',
            ftm: 3,
            fta: 5,
            ftp: '60.0',
            tpm: 0,
            tpa: 2,
            tpp: '0',
            offReb: 1,
            defReb: 1,
            totReb: 2,
            assists: 1,
            pFouls: 3,
            steals: 0,
            turnovers: 1,
            blocks: 0,
            plusMinus: '-3',
          },
        },
        {
          player: { firstname: 'B', lastname: 'Siakam' },
          boxScore: {
            points: 15,
            min: '20',
            fgm: 6,
            fga: 8,
            fgp: '38.5',
            ftm: 4,
            fta: 6,
            ftp: '60.0',
            tpm: 0,
            tpa: 2,
            tpp: '0',
            offReb: 1,
            defReb: 1,
            totReb: 2,
            assists: 1,
            pFouls: 3,
            steals: 0,
            turnovers: 1,
            blocks: 0,
            plusMinus: '-3',
          },
        },
        {
          player: { firstname: 'C', lastname: 'Siakam' },
          boxScore: {
            points: 10,
            min: '20',
            fgm: 4,
            fga: 7,
            fgp: '37.5',
            ftm: 3,
            fta: 5,
            ftp: '60.0',
            tpm: 0,
            tpa: 2,
            tpp: '0',
            offReb: 1,
            defReb: 1,
            totReb: 2,
            assists: 1,
            pFouls: 3,
            steals: 0,
            turnovers: 1,
            blocks: 0,
            plusMinus: '-3',
          },
        },
      ],
    },
    away: {
      name: 'Memphis Grizzlies',
      nickname: 'Grizzlies',
      code: 'MEM',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Memphis_Grizzlies.svg/1200px-Memphis_Grizzlies.svg.png',
      data: [
        {
          player: { firstname: 'P', lastname: 'Siakam' },
          boxScore: {
            points: 20,
            min: '20',
            fgm: 8,
            fga: 10,
            fgp: '37.5',
            ftm: 3,
            fta: 4,
            ftp: '60.0',
            tpm: 0,
            tpa: 2,
            tpp: '0',
            offReb: 1,
            defReb: 1,
            totReb: 2,
            assists: 1,
            pFouls: 3,
            steals: 0,
            turnovers: 1,
            blocks: 0,
            plusMinus: '-3',
          },
        },
        {
          player: { firstname: 'PP', lastname: 'Siakam' },
          boxScore: {
            points: 5,
            min: '10',
            fgm: 4,
            fga: 9,
            fgp: '37.5',
            ftm: 1,
            fta: 2,
            ftp: '60.0',
            tpm: 0,
            tpa: 2,
            tpp: '0',
            offReb: 1,
            defReb: 1,
            totReb: 2,
            assists: 1,
            pFouls: 3,
            steals: 0,
            turnovers: 1,
            blocks: 0,
            plusMinus: '-3',
          },
        },
        {
          player: { firstname: 'Pascal', lastname: 'Siakam' },
          boxScore: {
            points: 30,
            min: '30',
            fgm: 5,
            fga: 8,
            fgp: '37.5',
            ftm: 10,
            fta: 11,
            ftp: '60.0',
            tpm: 0,
            tpa: 2,
            tpp: '0',
            offReb: 1,
            defReb: 1,
            totReb: 2,
            assists: 1,
            pFouls: 3,
            steals: 0,
            turnovers: 1,
            blocks: 0,
            plusMinus: '-3',
          },
        },
      ],
    },
  };

  const handleSortState = (index: number, team: 'home' | 'away') => {
    // 선수명 기준으로는 정렬하지 않음
    if (index === 0) return;

    if (team === 'home') {
      setHomeSortState((prev) => ({
        key: index,
        descending: prev.key === index ? !prev.descending : true,
      }));
    } else {
      setAwaySortState((prev) => ({
        key: index,
        descending: prev.key === index ? !prev.descending : true,
      }));
    }
  };

  const getSortedData = (data, sortState: SortState) => {
    // 정렬 기준이 없는 경우 기존 데이터 반환
    if (sortState.key === null) return data;

    // 값을 숫자로 변환 후 정렬
    return [...data].sort((a, b) => {
      const aValue = Number(Object.values(a.boxScore)[sortState.key! - 1]);
      const bValue = Number(Object.values(b.boxScore)[sortState.key! - 1]);

      return sortState.descending ? bValue - aValue : aValue - bValue;
    });
  };

  if (dto.game.status === 'scheduled') {
    return (
      <div className={styles.scheduledGame}>경기 시작 후 업데이트 됩니다.</div>
    );
  }

  return (
    <div className={styles.boxScoreContainer}>
      {/* 원정 팀 */}
      <BoxScoreTable
        teamData={dto.away}
        sortedData={getSortedData(dto.away.data, awaySortState)}
        onClick={(index: number) => handleSortState(index, 'away')}
        visitor={true}
        selectedIndex={awaySortState.key}
      />
      {/* 홈 팀 */}
      <BoxScoreTable
        teamData={dto.home}
        sortedData={getSortedData(dto.home.data, homeSortState)}
        onClick={(index: number) => handleSortState(index, 'home')}
        visitor={false}
        selectedIndex={homeSortState.key}
      />
    </div>
  );
};

export default BoxScore;
