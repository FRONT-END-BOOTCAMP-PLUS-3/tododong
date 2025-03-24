'use client';

import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  isAlert?: boolean;
};

const Modal = ({
  children,
  isOpen,
  onClose,
  onConfirm = onClose,
  isAlert = false,
  ...restProps
}: ModalProps): React.ReactElement => {
  useBodyScrollLock(isOpen);

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<Element | null>(null);

  // Focus Trapping (포커스가 모달창 밖으로 벗어나지 않게 함)
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 포커스가 있던 요소 기억
      lastFocusedElement.current = document.activeElement;

      const dialogElement = dialogRef.current;

      // focusable HTML 요소 수집
      // use 태그에서 href를 사용하고 있기 때문에 문제가 생겨서 [href]에 not(use)를 붙여서 use는 수집하지 않음
      const focusableElements = dialogElement?.querySelectorAll(
        'button, [href]:not(use), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];

      // 모달 창 안의 첫 focusable 요소로 focus 이동
      dialogElement!.focus();

      const handleKeyPress = (event: KeyboardEvent) => {
        // tab(또는 shift + tab)키 눌렀을 때 모달 창을 벗어나지 않도록 설정
        if (event.key === 'Tab') {
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            (lastElement as HTMLElement).focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            event.preventDefault();
            (firstElement as HTMLElement).focus();
          }
        }
        // ESC 키로 모달 창을 닫을 수 있음
        if (event.key === 'Escape') {
          onClose();
        }
      };

      // 모달 창에 tab, esc 키 이벤트 구독 추가
      dialogElement!.addEventListener('keydown', handleKeyPress);

      return () => {
        // 이벤트 구독 제거
        dialogElement!.removeEventListener('keydown', handleKeyPress);
      };
    } else if (lastFocusedElement.current) {
      // 모달이 닫힐 때 포커스를 이전에 있었던 요소로 이동
      (lastFocusedElement.current as HTMLElement).focus();
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // 클릭된 요소가 모달 콘텐츠가 아닌 경우에만 closeModal 호출
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div onClick={handleOverlayClick} className={styles.overlay}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={styles.dialog}
            {...restProps}
          >
            <Image
              src="/logo_sm.png"
              alt="토도동 로고"
              width={76}
              height={60}
            />
            {children}
            <div className={styles.buttonWrapper}>
              {!isAlert && (
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={onClose}
                >
                  취소
                </button>
              )}
              <button
                type="button"
                className={styles.confirmBtn}
                onClick={onConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

/* 사용 예시
const [isModalOpen, setIsModalOpen] = useState(false);

return (
  <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }}>
    <h2>제목</h2>
    <p>내용</p>
  </Modal>
)
*/
