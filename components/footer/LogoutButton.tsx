'use client';

import { useState } from 'react';
import Modal from '../modal/Modal';
import styles from './LogoutButton.module.scss';

const LogoutButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalConfirm = () => {
    // 로그아웃 로직 추가
    setIsModalOpen(false);
    location.reload();
  };
  return (
    <>
      <button
        className={styles.logoutButton}
        onClick={() => setIsModalOpen(true)}
      >
        로그아웃
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={handleModalConfirm}
      >
        <p>로그아웃 하시겠습니까?</p>
      </Modal>
    </>
  );
};

export default LogoutButton;
