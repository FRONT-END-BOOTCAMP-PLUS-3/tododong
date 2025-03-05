'use client';

import { useState } from 'react';
import Icon from '../icon/Icon';
import Modal from '../modal/Modal';
import ProfileCard from './ProfileCard';
import styles from './UserDropDown.module.scss';

export type ModalAction = '' | 'logout' | 'delete';

const UserDropDown = ({
  userInfo,
}: {
  userInfo: { nickname: string; email: string };
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ModalAction>('');

  const handleModalBtnClick = (action: ModalAction) => () => {
    setModalAction(action);
  };

  const handleModalConfirm = async () => {
    if (modalAction === 'logout') {
      await fetch('/api/logout', { method: 'POST' });
      location.reload();
    }
    if (modalAction === 'delete') {
      // 계정 삭제 로직 추가
      location.reload();
    }
  };

  return (
    <>
      <div className={styles.userDropDown}>
        <span>{userInfo.nickname}님</span>
        <button type="button" onClick={() => setIsProfileOpen((prev) => !prev)}>
          {isProfileOpen ? (
            <Icon id="up" width={14} />
          ) : (
            <Icon id="down" width={14} />
          )}
        </button>
      </div>
      {isProfileOpen && (
        <ProfileCard userInfo={userInfo} onBtnClick={handleModalBtnClick} />
      )}

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

export default UserDropDown;
