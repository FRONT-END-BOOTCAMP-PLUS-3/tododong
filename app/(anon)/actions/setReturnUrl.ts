'use server';

import { cookies } from 'next/headers';

export const setReturnUrl = async (pathname: string) => {
  const cookieStore = await cookies();
  cookieStore.set('returnUrl', pathname);
};
