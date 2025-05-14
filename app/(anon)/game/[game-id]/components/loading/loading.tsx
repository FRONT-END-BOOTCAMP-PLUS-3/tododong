import styles from './loading.module.scss';

const Loading = () => {
  return (
    <>
      <div className={styles.todayGameContainer}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className={styles.todayGame} />
        ))}
      </div>
      <div className={styles.container}>
        <div className={styles.mainInfo}>
          <div className={styles.gameStatus} />
          <div className={styles.gamePageMain} />
        </div>
        <div className={styles.chat} />
      </div>
    </>
  );
};

export default Loading;
