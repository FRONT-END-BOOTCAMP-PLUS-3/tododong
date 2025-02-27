'use client';

import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Icon from '../icon/Icon';
import Modal from '../modal/Modal';
import styles from './Header.module.scss';
import ProfileCard from './ProfileCard';

export type ModalAction = '' | 'logout' | 'delete';

const Header = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ModalAction>('');

  // 로그인, 회원가입 페이지에서는 header 렌더링 X
  const hideHeaderRoutes = ['/login', '/signup'];
  if (hideHeaderRoutes.includes(pathname)) return null;

  const handleModalBtnClick = (action: ModalAction) => () => {
    setModalAction(action);
  };

  const handleModalConfirm = () => {
    if (modalAction === 'logout') {
      clearUser();
      location.reload();
    }
    if (modalAction === 'delete') {
      // 계정 삭제 로직 추가
      clearUser();
      location.reload();
    }
  };

  return (
    <>
      <header className={styles.header}>
        <Link href="/" aria-label="홈으로 이동">
          <Image
            src="/logo_header.png"
            alt=""
            width={76}
            height={60}
            priority
          />
        </Link>

        {user ? (
          <>
            <div className={styles.userInfo}>
              <span>{user.nickName}님</span>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
              >
                {isProfileOpen ? (
                  <Icon id="up" width={14} />
                ) : (
                  <Icon id="down" width={14} />
                )}
              </button>
            </div>
            {isProfileOpen && <ProfileCard onBtnClick={handleModalBtnClick} />}
          </>
        ) : (
          <Link href="/login" className={styles.loginBtn}>
            로그인
          </Link>
        )}
      </header>

      <div className={styles.spacer}></div>

      {/* 로그아웃, 계정삭제 모달창 */}
      <Modal
        isOpen={!!modalAction}
        onClose={() => setModalAction('')}
        onConfirm={handleModalConfirm}
      >
        {modalAction === 'logout' && <p>로그아웃 하시겠습니까?</p>}
        {modalAction === 'delete' && <p>계정을 삭제하시겠습니까?</p>}
      </Modal>
    </>
  );
};

export default Header;
