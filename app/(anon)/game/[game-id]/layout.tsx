import { GameDetailDto } from '@/application/usecases/game/game-detail/dto/gameDetailDto';
import { verifyToken } from '@/utils/auth';
import { JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import ChatSection from './components/chat/ChatSection';
import GamePageNav from './components/game-page-nav/GamePageNav';
import GameStatusSection from './components/game-status/GameStatusSection';
import TodayGameSection from './components/today/TodayGameSection';
import styles from './layout.module.scss';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ 'game-id': string }>;
}) => {
  const segment = await params;
  const gameId = segment['game-id'];

  const gameInfo = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/game/${gameId}`
  ).then((res) => res.json());

  return {
    title: `경기 상세 - 토도동`,
    description: `${gameInfo.teams.awayTeam.name} vs ${gameInfo.teams.homeTeam.name}의 유튜브 하이라이트 및 영상, 경기 기록, 실시간 중계를 확인해보세요.`,
  };
};

// 여기서 쿠키에서 토큰을 꺼내서 props로 유저 정보 전달
// 클라이언트에서는 쿠키를 쓸 수 없음
interface JWTPayloadWithUser extends JWTPayload {
  id: string;
  nickname: string;
}

const GameLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ 'game-id': string }>;
}) => {
  const segment = await params;
  const gameId = segment['game-id'];

  // 쿠키에서 토큰 꺼내고, 토큰에서 유저 정보 꺼내기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || '';

  let userInfo: JWTPayloadWithUser = { id: '', nickname: '' };

  if (accessToken) {
    const decoded = (await verifyToken(accessToken)) as JWTPayloadWithUser;
    if (decoded) userInfo = decoded;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/game/${gameId}`
  );

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
  }

  const gameInfo: GameDetailDto = await response.json();

  return (
    <>
      <TodayGameSection />
      <div className={styles.container}>
        <div className={styles.mainInfo}>
          <GameStatusSection initialGameInfo={gameInfo} />
          <div className={styles.gamePageMain}>
            <GamePageNav gameId={gameId} />
            {children}
          </div>
        </div>
        <ChatSection
          userInfo={userInfo}
          gameId={gameId}
          gameState={gameInfo.gameStatus}
        />
      </div>
    </>
  );
};

export default GameLayout;
