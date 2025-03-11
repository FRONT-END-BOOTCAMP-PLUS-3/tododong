// io : 전체 클라이언트와 상호작용
// socket : 개별 클라이언트와 상호작용 (emit: 클라이언트에 데이터 보내기, on : 클라이언트에서 데이터 받기)
import { createServer } from 'http'; // Next.js의 기본 서버가 아니라, 커스텀 서버를 사용하기 위해 직접 HTTP 서버를 생성
import next from 'next'; // Next.js 서버를 실행하기 위한 라이브러리
import { Server as SocketIOServer } from 'socket.io'; // socket.io에서 제공하는 WebSocket 서버, Server라는 이름이 다른 곳에서 사용될 수 있으니 별칭 설정

const dev = process.env.NODE_ENV !== 'production'; // 개발 환경이면 true, 프로덕션 환경이면 false
const app = next({ dev }); // Next.js 앱 객체가 생성됨
const handle = app.getRequestHandler(); // Next.js의 기본 요청 핸들러

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res); // 페이지 및 API 요청 처리
  });

  const io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    // 클라이언트가 WebSocket에 연결되었을 때 실행
    console.log('클라이언트 연결됨:', socket.id);
    // 채팅방 입장 요청
    socket.on('joinRoom', ({ gameId }) => {
      console.log(`User joined room: ${gameId}`);
      socket.join(gameId);
    });
    // prisma로 조회하는 부분을 api에서 처리

    // 클라이언트로부터 새로운 메시지를 받으면 다른 클라이언트에 브로드캐스트
    socket.on('newMessage', (data) => {
      io.to(data.gameId).emit('newMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('클라이언트 연결 종료:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
  });
});
