export interface Statistics {
  teamId: string; // 팀 id
  name: string; // 이름
  assists: number; // 어시스트
  blocks: number; // 블락
  fieldGoalsAttempted: number; // 야투 시도
  fieldGoalsMade: number; // 야투 성공
  fieldGoalsPercentage: number; // 야투율
  foulsPersonal: number; // 파울
  freeThrowsAttempted: number; // 자유투 시도
  freeThrowsMade: number; // 자유투 성공
  freeThrowsPercentage: number; // 자유투 성공률
  minutes: string; // 출장 시간
  plusMinusPoints: number; // 득실
  points: number; // 점수
  reboundsDefensive: number; // 수비 리바운드
  reboundsOffensive: number; // 공격 리바운드
  reboundsTotal: number; // 리바운드
  steals: number; // 스틸
  threePointersAttempted: number; // 3점 시도
  threePointersMade: number; // 3점 성공
  threePointersPercentage: number; // 3점 성공률
  turnovers: number; // 실책
}
