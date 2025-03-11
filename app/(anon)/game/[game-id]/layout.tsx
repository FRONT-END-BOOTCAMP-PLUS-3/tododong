import styles from './layout.module.scss';
import ChatSection from './components/chat/ChatSection';
import GameStatusSection from './components/game-status/GameStatusSection';
import TodayGameSection from './components/today/TodayGameSection';
import GamePageNav from './components/game-page-nav/GamePageNav';

const GameLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ 'game-id': string }>;
}) => {
  const segment = await params;
  const gameId = segment['game-id'];

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
        <ChatSection />
      </div>
    </>
  );
};

export default GameLayout;
