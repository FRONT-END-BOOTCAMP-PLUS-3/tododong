'use client';

import Image from 'next/image';
import { useLayoutEffect } from 'react';
import styles from './Loader.module.scss';

type LoaderProps = {
  className?: string;
  size?: number;
};

const Loader = ({ className, size }: LoaderProps) => {
  // 로딩 시작, 완료를 알려줌
  // https://aoa.gitbook.io/skymimo/aoa-2018/2018-aria/loading
  useLayoutEffect(() => {
    const loadingStartElement = document.getElementById('loading-start');
    const loadingEndElement = document.getElementById('loading-end');

    if (loadingStartElement) {
      loadingStartElement.innerHTML = '<p class="srOnly">로딩중...</p>';
      loadingStartElement.setAttribute('role', 'alert');
    }

    return () => {
      if (loadingStartElement) {
        loadingStartElement.innerHTML = '';
        loadingStartElement.removeAttribute('role');
      }
      if (loadingEndElement) {
        loadingEndElement.innerHTML = '<p class="srOnly">로딩완료</p>';
        setTimeout(() => {
          loadingEndElement.innerHTML = '';
        }, 1000);
      }
    };
  }, []);

  return (
    <div className={`${styles.loader} ${className}`}>
      <Image
        src="/loader.png"
        className={styles.spinner}
        width={size || 52}
        height={size || 52}
        alt="로딩 이미지"
      />
    </div>
  );
};

export default Loader;

/*
사용 예시 1: (width), height 지정
<Loader className={styles.loader} />

사용 예시 2: 농구공 크기 조정 필요할 때
<Loader className={styles.loader} size={20}/>
*/
