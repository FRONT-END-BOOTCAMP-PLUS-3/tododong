// 경기 정보
interface GameDto {
  id: string;
  status: string;
  clock: string;
  quarter: number;
  date: string;
}

// 팀 정보
interface TeamDto {
  name: string;
  code: string;
  id: string;
}

// 이벤트 정보
export interface EventDto {
  id: string;
  clock: string;
  description: string;
  away_points?: number;
  home_points?: number;
  created: string;
  statistics?: {
    made?: boolean;
    points?: number;
    type: string;
    team: { id: string };
  }[];
}

// 쿼터 정보
interface QuarterDto {
  id: string;
  quarter: number;
  events: EventDto[];
}

// 전체 Play-by-Play 데이터 구조
export interface PlayByPlayDto {
  game: GameDto;
  home: TeamDto;
  away: TeamDto;
  quarters: QuarterDto[];
}
