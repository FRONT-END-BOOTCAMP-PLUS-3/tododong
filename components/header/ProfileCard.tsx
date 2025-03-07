import styles from './ProfileCard.module.scss';
import { ModalAction } from './UserDropDown';

const ProfileCard = ({
  userInfo,
  onBtnClick,
}: {
  userInfo: { nickname: string; email: string };
  onBtnClick: (action: ModalAction) => () => void;
}) => {
  return (
    <div
      role="region"
      aria-labelledby="profile-heading"
      className={styles.profileCard}
    >
      <div>
        <div className={styles.profileHeader}>
          <h2 id="profile-heading">{userInfo.nickname}님</h2>
          <button type="button" onClick={onBtnClick('logout')}>
            로그아웃
          </button>
        </div>
        <span className="srOnly">이메일:</span>
        <p>{userInfo.email}</p>
      </div>
      <button
        className={styles.deleteBtn}
        type="button"
        onClick={onBtnClick('delete')}
      >
        계정 삭제
      </button>
    </div>
  );
};

export default ProfileCard;
