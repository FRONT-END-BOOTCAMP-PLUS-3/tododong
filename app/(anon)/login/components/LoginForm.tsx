'use client';

import AuthInput from '@/components/auth-input/AuthInput';
import Icon from '@/components/icon/Icon';
import { fetcher } from '@/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const router = useRouter();

  /* --------------------------------- states --------------------------------- */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFormFilled = Object.values(formData).every((value) => value.trim());

  /* -------------------------------- functions ------------------------------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 로그인 요청
    try {
      await fetcher(
        '/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
        setIsLoading
      );

      // 로그인 성공 시 홈으로 이동
      router.push('/');
    } catch (error) {
      console.error(error);
      // 로그인 실패 시 에러 메시지 표시
      setIsInvalid(true);
    }
  };

  /* -------------------------------- rendering ------------------------------- */
  return (
    <form onSubmit={handleSubmit} aria-label="로그인" className={styles.form}>
      <AuthInput
        type="email"
        placeholder="이메일"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <AuthInput
        type="password"
        placeholder="비밀번호"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
      />

      {/* 오류 메세지 */}
      {isInvalid && (
        <div role="alert" className={styles.message}>
          <Icon id="info" width={16} color="#fa2f2f" aria-hidden />
          아이디 또는 비밀번호가 잘못되었습니다.
          <br />
          아이디와 비밀번호를 정확히 입력해 주세요.
        </div>
      )}

      <button type="submit" disabled={!isFormFilled || isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
};

export default LoginForm;
