import { verifyToken } from '@/utils/auth';
import { JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import ChatSection from './components/chat/ChatSection';
import GamePageNav from './components/game-page-nav/GamePageNav';
import GameStatusSection from './components/game-status/GameStatusSection';
import TodayGameSection from './components/today/TodayGameSection';
import styles from './layout.module.scss';

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

  console.log(userInfo);

  return (
    <>
      <TodayGameSection />
      <div className={styles.container}>
        <div>
          <GameStatusSection />
          <div className={styles.gamePageMain}>
            <GamePageNav gameId={gameId} />
            {children}
          </div>
        </div>
        <ChatSection userInfo={userInfo} gameId={gameId} />
      </div>
    </>
  );
};

export default GameLayout;
