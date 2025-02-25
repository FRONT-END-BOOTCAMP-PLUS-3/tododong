'use client';

import AuthInput from '@/components/auth-input/AuthInput';
import Icon from '@/components/icon/Icon';
import React, { useActionState, useState } from 'react';
import { loginProc } from '../actions/loginProc';
import styles from './LoginForm.module.scss';

const initialState = {
  message: '',
};

const LoginForm = () => {
  /* --------------------------------- states --------------------------------- */
  const [state, formAction, pending] = useActionState(loginProc, initialState);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const isFormFilled = Object.values(formData).every((value) => value.trim());

  /* -------------------------------- functions ------------------------------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------------------- rendering ------------------------------- */
  return (
    <form action={formAction} aria-label="로그인" className={styles.form}>
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
      {state.message && (
        <div role="alert" className={styles.message}>
          <Icon id="info" width={16} color="#fa2f2f" aria-hidden />
          {state.message}
        </div>
      )}

      <button type="submit" disabled={!isFormFilled || pending}>
        {pending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
};

export default LoginForm;
