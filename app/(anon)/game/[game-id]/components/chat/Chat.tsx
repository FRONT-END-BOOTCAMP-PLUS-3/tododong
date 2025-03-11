import styles from './Chat.module.scss';

type ChatProps = {
  msg: {
    userNickname: string;
    message: string;
  };
};

const getUserColor = (userNickname: string) => {
  const colors = ['#f3ce12', '#1ABC9C', '#E74C3C', '#8E44AD', '#3498DB']; // 다크 모드 최적화 색상

  // UUID의 각 문자의 ASCII 코드를 더해서 숫자로 변환
  const hash = userNickname
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // 색상 배열의 길이로 나눈 나머지를 색상 인덱스로 사용
  return colors[hash % colors.length];
};

const Chat = ({ msg }: ChatProps) => {
  const nicknameColor = getUserColor(msg.userNickname); // userId 기반 색상 결정

  return (
    <div className={styles.container}>
      <span style={{ color: nicknameColor }}>{msg.userNickname}</span>
      <span className="srOnly">님의 메세지</span>
      <span>{msg.message}</span>
    </div>
  );
};

export default Chat;
