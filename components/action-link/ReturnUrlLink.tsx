'use client';

import { setReturnUrl } from '@/app/(anon)/actions/setReturnUrl';
import { AnchorHTMLAttributes, ReactNode, useTransition } from 'react';

type ReturnUrlLinkProps = {
  children: ReactNode;
  href: string;
  pathname: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const ReturnUrlLink = ({
  children,
  href,
  pathname,
  ...restProps
}: ReturnUrlLinkProps) => {
  const [_, startTransition] = useTransition();

  const handleLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    startTransition(async () => {
      await setReturnUrl(pathname); // 현재 경로를 쿠키에 저장
      window.location.href = href; // 새로고침하면서 로그인 페이지로 이동
    });
  };

  return (
    <a href={href} onClick={handleLogin} {...restProps}>
      {children}
    </a>
  );
};

export default ReturnUrlLink;
