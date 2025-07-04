'use client';
import { setReturnUrl } from '@/app/(anon)/actions/setReturnUrl';
import { ChatMessageDto } from '@/application/usecases/chat/dto/chatMessageDto';
import { CreateMessageDto } from '@/application/usecases/chat/dto/createMessageDto';
import Icon from '@/components/icon/Icon';
import Modal from '@/components/modal/Modal';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { useMediaStore } from '@/stores/mediaStore';
import { fetcher } from '@/utils';
import { motion, PanInfo } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';
import styles from './ChatSection.module.scss';

let socket: ReturnType<typeof io>;

// userNickname? 없으면 로그인모달, 채팅 x
// 토큰이 없거나 만료되면 undefind/null ->
const ChatSection = ({
  userInfo,
  gameId,
  gameState,
}: {
  userInfo: { id: string; nickname: string };
  gameId: string;
  gameState: string;
}) => {
  const media = useMediaStore((state) => state.media);
  const pathname = usePathname();
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
    socket = io(`${process.env.SOCKET_URL || 'https://tododong.com'}`, {
      path: '/socket.io',
      transports: ['websocket'],
    });
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

      // 실시간 소켓 브로드캐스트
      socket.emit('newMessage', newMsg);

      // 메시지를 직접 추가하지 않고, 소켓을 통해 수신되도록 함
      socket.emit('sendMessage', newMsg); // 여기서 emit 이벤트 이름도 통일

      setValue(''); // 입력창 초기화
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === '토큰이 만료되었습니다.') {
          setIsModalOpen(true);
        }
        console.error(error.message);
      }
      return;
    }
  };

  // 로그인 후 돌아올 경로 저장
  const [, startTransition] = useTransition();
  const handleModalConfirm = () => {
    startTransition(async () => {
      await setReturnUrl(pathname); // 현재 경로를 쿠키에 저장
      window.location.href = '/login'; // 새로고침하면서 로그인 페이지로 이동
    });

    setIsModalOpen(false);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  useBodyScrollLock(isExpanded);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;

    // 닫기
    if (offset > 50 || velocity > 500) {
      setIsExpanded(false);
    }
    // 열기
    else if (offset < -50 || velocity < -500) {
      setIsExpanded(true);
    }
  };

  return (
    <div
      style={
        isExpanded
          ? {
              backdropFilter: 'blur(2px)',
            }
          : {}
      }
      className={styles.container}
    >
      <section
        style={
          media !== 'desktop'
            ? {
                translate: isExpanded ? '0 0' : '0 calc(70vh - 3.75rem)',
                transition: 'translate 0.3s ease-in-out',
              }
            : {}
        }
        className={styles.chatSection}
      >
        <motion.div
          {...(media !== 'desktop'
            ? {
                drag: 'y',
                dragConstraints: { top: 0, bottom: 0 },
                onDragEnd: handleDragEnd,
                dragElastic: 0,
              }
            : {})}
          className={styles.chatTitle}
        >
          채팅
        </motion.div>
        <div className={styles.chatContainer}>
          {gameState === 'scheduled' ? (
            <p className={styles.scheduleNotice}>
              경기 시작 후 채팅에 참여 가능합니다.
            </p>
          ) : (
            messages.map((msg, index) => <Chat key={index} msg={msg} />)
          )}
        </div>
        <form
          className={styles.chatInputContainer}
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <div>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="채팅을 입력하세요."
              disabled={gameState === 'scheduled'}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
            />
            <button
              className={styles.iconArrowUp}
              disabled={!value || gameState === 'scheduled'}
              aria-label="메세지 보내기"
            >
              <Icon id="arrow-up" width={11.15} height={12.6} />
            </button>
          </div>
        </form>
      </section>
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
    </div>
  );
};

export default ChatSection;
