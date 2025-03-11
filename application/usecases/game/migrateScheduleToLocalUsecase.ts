import { GameRepository } from '@/domain/repositories/GameRepository';
import { NbaGameRepository } from '@/domain/repositories/NbaGameRepository';

export const migrateScheduleToLocalUsecase = async (
  externalRepository: NbaGameRepository,
  localRepository: GameRepository
): Promise<void> => {
  const games = await externalRepository.findAll();

  // 경기시간 오름차순 정랼
  games.sort((a, b) => {
    const dateA = new Date(a.startTime);
    const dateB = new Date(b.startTime);

    return dateA.getTime() - dateB.getTime(); // 오름차순 정렬
  });

  // status 문자열로 변환
  // UTC → 한국 시간 (KST, UTC+9) 변환 후 날짜 필드 추가
  const processedGames = games.map((game) => {
    let gameStatus = '';

    switch (game.status) {
      case '1':
        gameStatus = 'scheduled';
        break;

      case '2':
        gameStatus = 'live';
        break;

      case '3':
        gameStatus = 'final';
        break;

      default:
        break;
    }

    const startTimeUTC = new Date(game.startTime);

    let year = startTimeUTC.getUTCFullYear();
    let month = startTimeUTC.getUTCMonth() + 1;
    let day = startTimeUTC.getUTCDate();
    let hours = startTimeUTC.getUTCHours() + 9;

    // 넘침 처리
    if (hours >= 24) {
      hours -= 24;
      day += 1; // 일 증가
      if (day > new Date(year, month, 0).getDate()) {
        day = 1; // 새로운 월로 넘어가면 1일로 설정
        month += 1; // 월 증가
        if (month === 13) {
          month = 1; // 1월로 설정
          year += 1; // 연도 증가
        }
      }
    }

    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours =
      hours % 12 === 0 ? 12 : String(hours % 12).padStart(2, '0');
    const minutes = String(startTimeUTC.getUTCMinutes()).padStart(2, '0');

    const dateKST = `${year}-${formattedMonth}-${formattedDay}`; // YYYY-MM-DD 형태
    const startTimeKST = `${year}. ${formattedMonth}. ${formattedDay} ${formattedHours}:${minutes} ${ampm} KST`;

    return {
      ...game,
      status: gameStatus,
      startTime: startTimeKST,
      date: dateKST,
    };
  });

  await localRepository.saveGames(processedGames);
};
