import styles from './Chat.module.scss';

const Chat = () => {
  return (
    <div className={styles.container}>
      <p>닉네임</p>
      <p>채팅 내용</p>
    </div>
  );
};

export default Chat;
