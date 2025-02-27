'use client';

import styles from './Footer.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Icon from '../icon/Icon';
import Modal from '../modal/Modal';

const Footer = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 로그인, 회원가입 페이지에서는 footer 렌더링 X
  const hideHeaderRoutes = ['/login', '/signup'];
  if (hideHeaderRoutes.includes(pathname)) return null;

  const handleModalConfirm = () => {
    clearUser();
    setIsModalOpen(false);
    location.reload();
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image
            src="/logo_footer.png"
            width={65}
            height={51}
            alt="footer 로고"
          />
          <div>
            <address>
              상호명: 토도동 | 대표: 김승수 | 이메일: tododong@gmail.com
              <br />
              주소: 서울 중구 퇴계로 324, 성우빌딩 10층
            </address>
            <p>© tododong. All rights reserved.</p>
          </div>
          <ul className={styles.termWrapper}>
            <li>
              {user ? (
                <button onClick={() => setIsModalOpen(true)}>로그아웃</button>
              ) : (
                <Link href="/login" className={styles.loginLink}>
                  로그인
                </Link>
              )}
            </li>
            <li>
              <Link href="">이용약관</Link>
            </li>
            <li>
              <Link href="">광고문의</Link>
            </li>
            <li>
              <Link href="">개인정보처리방침</Link>
            </li>
            <li>
              <Link href="">공지사항</Link>
            </li>
          </ul>
          <ul className={styles.socialList}>
            <li>
              <Link href="">
                <Icon id="facebook" width={24} color="#000" />
              </Link>
            </li>
            <li>
              <Link href="">
                <Icon id="instagram" width={24} color="#000" />
              </Link>
            </li>
            <li>
              <Link href="https://github.com/FRONT-END-BOOTCAMP-PLUS-3/tododong/tree/main">
                <Icon id="github" width={24} color="#000" />
              </Link>
            </li>
          </ul>
        </div>
      </footer>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onConfirm={handleModalConfirm}
        >
          <p>로그아웃 하시겠습니까?</p>
        </Modal>
      )}
    </>
  );
};

export default Footer;
