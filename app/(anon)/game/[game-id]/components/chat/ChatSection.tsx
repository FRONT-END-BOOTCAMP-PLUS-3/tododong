'use client';
import { ChatMessageDto } from '@/application/usecases/chat/dto/chatMessageDto';
import { CreateMessageDto } from '@/application/usecases/chat/dto/createMessageDto';
import Icon from '@/components/icon/Icon';
import Modal from '@/components/modal/Modal';
import { fetcher } from '@/utils';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';
import styles from './ChatSection.module.scss';

let socket: ReturnType<typeof io>;

// userNickname? 없으면 로그인모달, 채팅 x
// 토큰이 없거나 만료되면 undefind/null ->
const ChatSection = ({
  userInfo,
  gameId,
}: {
  userInfo: { id: string; nickname: string };
  gameId: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]); // initMessage
  const [value, setValue] = useState('');

  // 초기 메시지 API로 불러오기
  useEffect(() => {
    if (!gameId) return;

    const fetchInitMessage = async () => {
      try {
        const response = await fetcher<ChatMessageDto[]>(
          `/api/game/${gameId}/chat`,
          {}
        );
        setMessages(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInitMessage();
  }, [gameId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px'; // 높이 초기화
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 72)}px`; // 최대 3줄 높이 (72px) 제한
    }
  }, [value]);

  // 소켓 연결 및 이벤트 등록
  useEffect(() => {
    // 소켓 연결
    socket = io();
    socket.emit('joinRoom', { gameId });

    // 실시간 새 메시지 수신
    socket.on('newMessage', (data: ChatMessageDto) => {
      if (data.gameId !== gameId) return; // 현재 채팅방과 다른 방의 메시지 무시
      setMessages((prev) => [data, ...prev]);
    });

    return () => {
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [gameId]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 메시지 전송 함수
  const sendMessage = async () => {
    if (value.trim() === '') return;
    if (!gameId) return;

    if (userInfo.id === '' || userInfo.nickname === '') {
      setIsModalOpen(true);
      return;
    }

    // 보낼 메시지 객체
    const newMsg: CreateMessageDto = {
      gameId,
      userId: userInfo.id,
      userNickname: userInfo.nickname,
      message: value,
    };

    // DB에 메시지 저장 (API POST 호출)
    try {
      const response = await fetcher<CreateMessageDto>(
        `/api/game/${gameId}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMsg),
        }
      );
      if (response) {
        console.log('데이터 생성 성공');
      }
    } catch (error) {
      console.error(error);
    }

    // 실시간 소켓 브로드캐스트
    socket.emit('newMessage', newMsg);

    // 메시지를 직접 추가하지 않고, 소켓을 통해 수신되도록 함
    socket.emit('sendMessage', newMsg); // 여기서 emit 이벤트 이름도 통일

    setValue(''); // 입력창 초기화
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    location.href = '/login';
  };

  return (
    <section className={styles.container}>
      <div className={styles.chatTitle}>채팅</div>
      <div className={styles.chatContainer}>
        {messages.map((msg, index) => (
          <Chat key={index} msg={msg} />
        ))}
      </div>
      <div className={styles.chatInputContainer}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="채팅을 입력하세요."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className={styles.iconArrowUp}
          disabled={!value}
          onClick={sendMessage}
          aria-label="메세지 보내기"
        >
          <Icon id="arrow-up" width={11.15} height={12.6} />
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={handleModalConfirm}
      >
        <p>
          로그인 후 채팅에 참여할 수 있습니다.
          <br />
          로그인 하시겠습니까?
        </p>
      </Modal>
    </section>
  );
};

export default ChatSection;
