import { TeamRepository } from '@/domain/repositories/TeamRepository';
import { GameRepository } from '@/domain/repositories/GameRepository';
import { EventDto, PlaybyplayDto } from './dto/PlaybyplayDto';
import { PlaybyplayRepository } from '@/domain/repositories/PlaybyPlayRepository';
import { Playbyplay } from '@/domain/entities/Playbyplay';

const descriptionKor: Record<string, Record<string, string> | string> = {
  game: {
    'Game Start': '경기 시작',
    'Game End': '경기 종료',
  },
  period: {
    'Period Start': '쿼터 시작',
    'Period End': '쿼터 종료',
  },
  turnover: '턴오버',
  rebound: {
    'TEAM defensive REBOUND': '디펜스 리바운드',
    'TEAM offensive REBOUND': '오펜스 리바운드',
    default: '리바운드',
  },
  '3pt': {
    MISS: '3점슛 실패',
    default: '3점슛 성공',
  },
  '2pt': {
    MISS: '2점슛 실패',
    default: '2점슛 성공',
  },
  foul: {
    'loose ball personal FOUL': '루즈볼 파울',
    'personal FOUL': '개인 파울',
    'shooting personal FOUL': '슈팅 파울',
    'technical FOUL': '테크니컬 파울',
  },
  timeout: '타임아웃',
  block: '블록샷',
  violation: '바이얼레이션',
  freethrow: {
    'Free Throw 1': '첫 번째 자유투',
    'Free Throw 2': '두 번째 자유투',
    'Free Throw 3': '세 번째 자유투',
  },
  steal: '스틸',
  jumpball: '점프볼 획득',
};

const getDescriptionKor = (actionType: string, description: string): string => {
  const actionTypeData = descriptionKor[actionType];

  if (typeof actionTypeData === 'string') {
    return actionTypeData;
  } else if (typeof actionTypeData === 'object') {
    for (const key in actionTypeData) {
      if (description.includes(key)) {
        return actionTypeData[key];
      }
    }

    return actionTypeData.default;
  }

  return '';
};

export const readPlaybyplayUsecase = async (
  gameId: string,
  gameRepository: GameRepository,
  teamRepository: TeamRepository,
  playbyplayRepository: PlaybyplayRepository
): Promise<PlaybyplayDto> => {
  try {
    const playbyplay = await playbyplayRepository.findById(gameId);
    const events: EventDto[][] = new Array(4).fill(null).map(() => []);

    // 쿼터별 데이터로 변환
    playbyplay.forEach((item: Playbyplay) => {
      const index = item.period - 1;

      // actionType === 'substitution' (선수 교체)인 경우 제외
      if (item.actionType === 'substitution') return;

      // description 속성의 '()'가 포함된 문자열 제거
      item.description = item.description.replace(/\(.*?\)/g, '').trim();

      const descriptionKor =
        item.actionType === 'game' || item.actionType === 'period'
          ? getDescriptionKor(item.actionType, item.description)
          : `${item.playerName ?? ''} ${getDescriptionKor(item.actionType, item.description)}`;

      events[index].push({ ...item, descriptionKor });
    });

    const game = await gameRepository.findById!(gameId);
    if (!game) {
      throw new Error(`게임(${gameId}) 정보가 없습니다.`);
    }

    const homeTeam = await teamRepository.findById(game.homeTeamId);
    if (!homeTeam) {
      throw new Error(`홈팀(${game.homeTeamId}) 정보가 없습니다.`);
    }
    const awayTeam = await teamRepository.findById(game.awayTeamId);
    if (!awayTeam) {
      throw new Error(`어웨이팀(${game.awayTeamId}) 정보가 없습니다.`);
    }

    return {
      game: { gameId, date: game.date, status: game.status, events },
      homeTeam,
      awayTeam,
    };
  } catch (error) {
    console.error(error);
    throw new Error('에러 발생');
  }
};
