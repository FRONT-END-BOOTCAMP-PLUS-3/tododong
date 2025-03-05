'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginProc(
  state: { message: string },
  formData: FormData
) {
  // 폼 데이터에서 email과 password 추출
  const email = formData.get('email');
  const password = formData.get('password');

  // 필수 값이 누락된 경우 리다이렉트 (에러 처리)
  if (!email || !password) {
    return {
      message:
        '아이디 또는 비밀번호가 잘못되었습니다.\n아이디와 비밀번호를 정확히 입력해 주세요.',
    };
  }

  // /api/login 엔드포인트에 POST 요청
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  // 로그인 실패 시 (에러 처리)
  if (!res.ok) {
    return {
      message:
        '아이디 또는 비밀번호가 잘못되었습니다.\n아이디와 비밀번호를 정확히 입력해 주세요.',
    };
  }

  // /api/login 엔드포인트가 JWT 토큰을 JSON 형식({ token: string })으로 반환한다고 가정
  const { token } = await res.json();

  console.log('==== actions/login 로그인 성공 요청====');
  console.log('로그인 성공 token:', token);
  console.log('=====================================');

  // 쿠키 저장소를 가져온다. (await를 사용)
  const cookieStore = await cookies();

  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 24 * 60 * 60, // 1일 동안 유효
  });

  // 쿠키에 returnUrl 이 있는지 확인
  const returnUrl = cookieStore.get('returnUrl')?.value;
  // returnUrl이 있는 경우 디코딩 후 리다이렉트
  const redirectUrl = returnUrl ? decodeURIComponent(returnUrl) : '/';

  // 로그인 성공 시 메인 페이지로 리다이렉트
  redirect(redirectUrl);
}
