'use client';

import AuthInput from '@/components/auth-input/AuthInput';
import Icon from '@/components/icon/Icon';
import { fetcher, formatTime } from '@/utils';
import { FocusEvent, InputHTMLAttributes, useRef, useState } from 'react';
import styles from './SignupForm.module.scss';
import Modal from '@/components/modal/Modal';

type FormDataKeys =
  | 'email'
  | 'authCode'
  | 'password'
  | 'passwordCheck'
  | 'nickname';

// 유효성 검사 실패 문구
const messagePhrase = {
  email: '올바른 형식의 이메일 주소를 입력하세요.',
  authCode: '정확한 인증코드를 입력하세요.',
  password: '영문자, 숫자, 특수문자를 포함한 8~20자를 입력하세요.',
  passwordCheck: '비밀번호가 일치하지 않습니다.',
  nickname: '한글, 영어, 숫자로 된 2~8자 닉네임을 입력하세요.',
  duplicatedEmail: '이미 가입된 이메일입니다.',
  duplicatedNickName: '이미 사용 중인 닉네임입니다.',
};

const SignupForm = () => {
  type ModalVarient =
    | ''
    | 'successSendEmail'
    | 'successVerify'
    | 'failVerify'
    | 'successSignup'
    | 'failSignup'
    | 'restoreEmail'
    | 'successRestoreEmail'
    | 'failRestoreEmail';

  /* ----------------------------------- refs ---------------------------------- */
  const timerRef = useRef<NodeJS.Timeout>(null);

  /* ---------------------------------- states --------------------------------- */
  const [formData, setFormData] = useState<Record<FormDataKeys, string>>({
    email: '',
    authCode: '',
    password: '',
    passwordCheck: '',
    nickname: '',
  });
  // 유효성 검사 메세지
  const [messages, setMessages] = useState<Record<FormDataKeys, string>>({
    email: '',
    authCode: '',
    password: '',
    passwordCheck: '',
    nickname: '',
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mailTime, setMailTime] = useState(0);
  const [openedModal, setOpenedModal] = useState<ModalVarient>('');

  /* --------------------------------- functions ------------------------------- */
  // input 값이 변경되면, formData 상태 업데이트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 유효성 검사 함수
  const isValid = (name: FormDataKeys, value: string) => {
    switch (name) {
      case 'email':
        // 이메일 형식
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      case 'authCode':
        return value.length >= 6;
      case 'password':
        // 영어, 숫자, 특수문자 포함 8~20자
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
          value
        );
      case 'passwordCheck':
        // password와 일치
        return value === formData.password;
      case 'nickname':
        // 한글, 영어만 가능 2~8자
        return /^[가-힣a-zA-Z0-9]{2,8}$/.test(value);
      default:
        return false;
    }
  };

  // 포커스가 벗어날 때 실행되는 유효성 검사
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setMessages((prev) => ({
      ...prev,
      [name]: isValid(name as FormDataKeys, value)
        ? ''
        : messagePhrase[name as FormDataKeys],
    }));
  };

  // 인증요청 버튼 클릭 시 실행
  const handleSendBtnClick = async () => {
    // '이메일 변경' 버튼일 때 '인증요청'으로 변경 및 타이머 초기화
    if (isEmailSent) {
      setIsEmailSent(false);
      setMailTime(0);
      return;
    }

    // 이메일 형식 틀리면 메세지 설정 및 함수 종료
    if (!isValid('email', formData.email)) {
      setMessages((prev) => ({
        ...prev,
        email: messagePhrase.email,
      }));
      return;
    } else setMessages((prev) => ({ ...prev, email: '' }));

    try {
      // input 비활성화
      setIsEmailSent(true);

      // 인증 요청
      await fetcher(
        '/api/user/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        },
        setIsEmailSending
      );

      setOpenedModal('successSendEmail');
      // 타이머 시작
      setMailTime(120);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setMailTime((prev) => prev - 1);
      }, 1000);
      // 에러
    } catch (err: unknown) {
      setIsEmailSent(false);
      setMailTime(0);

      if (err instanceof Error) {
        if (err.message === '이미 가입된 이메일입니다.') {
          setMessages((prev) => ({
            ...prev,
            email: messagePhrase.duplicatedEmail,
          }));
        }

        console.error(err.message);
      }
    }
  };

  // 인증번호 확인 버튼 클릭 시 실행
  const handleCheckBtnClick = async () => {
    // 확인 요청
    try {
      await fetcher('/api/user/verify/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.authCode,
        }),
      });

      // 타이머 종료 및 input 비활성화
      if (timerRef.current) clearInterval(timerRef.current);
      setMailTime(0);
      setIsVerified(true);
      setOpenedModal('successVerify');
    } catch (err) {
      setOpenedModal('failVerify');
      if (err instanceof Error) {
        if (err.message === '30일 이내에 탈퇴한 이메일입니다.') {
          setOpenedModal('restoreEmail');
        }
        console.error(err.message);
      }
    }
  };

  // 회원가입 버튼 클릭 시 실행
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 회원가입 요청
    try {
      await fetcher(
        '/api/user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            nickname: formData.nickname,
          }),
        },
        setIsLoading
      );
      setOpenedModal('successSignup');
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === '닉네임 중복') {
          setMessages((prev) => ({
            ...prev,
            nickname: messagePhrase.duplicatedNickName,
          }));
        }
        if (err.message === '이메일 중복') {
          setMessages((prev) => ({
            ...prev,
            email: messagePhrase.duplicatedEmail,
          }));
          setIsVerified(false);
          setIsEmailSent(false);
        }
        console.error(err.message);
      }

      setOpenedModal('failSignup');
    }
  };

  const handleRestoreEmail = async () => {
    if (isEmailSending) {
      alert('이메일 발송 중입니다. 잠시만 기다려주세요.');
      return;
    }

    try {
      await fetcher(
        '/api/user/restore',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        },
        setIsEmailSending
      );
      setOpenedModal('successRestoreEmail');
    } catch (err) {
      setOpenedModal('failRestoreEmail');
      if (err instanceof Error) console.error(err.message);
    }
  };

  /* ----------------------------- derived states ----------------------------- */
  // '로그인'버튼 활성화를 위한 상태
  const isFormValid = Object.entries(formData).every(([key, value]) =>
    isValid(key as FormDataKeys, value)
  );

  /* ---------------------------------- rendering --------------------------------- */
  // AuthInput 컴포넌트에 전달할 옵션
  // prettier-ignore
  const inputOptions: (InputHTMLAttributes<HTMLInputElement> & {
    name: FormDataKeys,
    label: string,
    children?: React.ReactElement;
  })[] = [
    { type: 'email', label: '이메일', name: 'email', disabled: isEmailSent },
    { type: 'text', label: '인증코드', name: 'authCode', disabled: isVerified },
    { type: 'password', label: '비밀번호', name: 'password', onBlur: handleBlur },
    { type: 'password', label: '비밀번호 확인', name: 'passwordCheck', onBlur: handleBlur },
    { type: 'text', label: '닉네임', name: 'nickname', onBlur: handleBlur },
  ];

  // input 오른쪽 버튼(+시간)을 렌더링하는 함수
  const renderInputChildren = (name: FormDataKeys) => {
    if (name === 'email') {
      return (
        <>
          {mailTime > 0 && (
            <time aria-label="인증번호 유효시간" className={styles.mailTime}>
              {formatTime(mailTime)}
            </time>
          )}
          <button
            type="button"
            className={styles.inputBtn}
            onClick={handleSendBtnClick}
            disabled={isVerified || isEmailSending}
            aria-live="assertive"
          >
            {isEmailSending
              ? '발송중...'
              : isEmailSent
                ? '이메일 변경'
                : '인증요청'}
          </button>
        </>
      );
    } else if (name === 'authCode') {
      return (
        <button
          type="button"
          className={styles.inputBtn}
          onClick={handleCheckBtnClick}
          disabled={isVerified || mailTime <= 0}
        >
          확인
        </button>
      );
    } else return;
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        aria-label="회원가입"
        className={styles.form}
      >
        {/* 5개의 input + 오류 메세지 */}
        {inputOptions.map((inputOption) => (
          <div key={inputOption.name}>
            <AuthInput
              value={formData[inputOption.name]}
              isInvalid={!!messages[inputOption.name]}
              onChange={handleInputChange}
              {...inputOption}
            >
              {renderInputChildren(inputOption.name)}
            </AuthInput>

            {/* 오류 메세지 (aria-polite 내부에 내용이 생기면 스크린 리더가 읽어줌) */}
            <div aria-live="polite">
              {messages[inputOption.name] && (
                <p className={styles.message}>
                  <Icon id="info" width={16} color="#fa2f2f" aria-hidden />
                  {messages[inputOption.name]}
                </p>
              )}
            </div>
          </div>
        ))}

        <button disabled={isLoading || !isVerified || !isFormValid}>
          {isLoading ? '회원가입 중...' : '회원가입'}
        </button>
      </form>

      {/* 모달창 */}
      <Modal
        isOpen={!!openedModal}
        onClose={() => {
          if (isEmailSending) {
            alert('이메일 발송 중입니다. 잠시만 기다려주세요.');
            return;
          }

          setOpenedModal('');
          if (
            openedModal === 'successSignup' ||
            openedModal === 'successRestoreEmail'
          )
            location.href = '/login';
        }}
        onConfirm={
          openedModal === 'restoreEmail' ? handleRestoreEmail : undefined
        }
        isAlert={openedModal !== 'restoreEmail'}
      >
        <div className={styles.alertModalContent}>
          {(() => {
            switch (openedModal) {
              case 'successSendEmail':
                return (
                  <p>
                    {'인증 코드가 메일로 발송되었습니다.\n2분 내 입력해주세요.'}
                  </p>
                );
              case 'successVerify':
                return <p>인증 성공</p>;
              case 'failVerify':
                return <p>인증 코드가 일치하지 않습니다.</p>;
              case 'successSignup':
                return (
                  <p>
                    {'회원가입에 성공했습니다.\n로그인 페이지로 이동합니다.'}
                  </p>
                );
              case 'failSignup':
                return <p>{'회원가입에 실패했습니다.\n다시 시도해 주세요'}</p>;
              case 'restoreEmail':
                return (
                  <p>
                    {'30일 이내에 탈퇴한 이메일입니다.\n\n' +
                      '탈퇴 후 30일 이내에는 재가입이 불가능합니다.\n' +
                      '기존 계정을 복구하시겠습니까?\n\n'}
                    <span className={styles.explanation}>
                      ("확인" 버튼을 누르면 해당 이메일로 임시 비밀번호가
                      발송됩니다.)
                    </span>
                  </p>
                );
              case 'successRestoreEmail':
                return (
                  <p>
                    {
                      '임시 비밀번호가 발송되었습니다.\n로그인 페이지로 이동합니다.'
                    }
                  </p>
                );
              case 'failRestoreEmail':
                return (
                  <p>
                    {'임시 비밀번호 발송에 실패했습니다.\n다시 시도해 주세요.'}
                  </p>
                );
              default:
                return null;
            }
          })()}
        </div>
      </Modal>
    </>
  );
};

export default SignupForm;
