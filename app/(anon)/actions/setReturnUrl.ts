'use server';

import { cookies } from 'next/headers';

export async function setReturnUrl(pathname: string) {
  const cookieStore = await cookies();
  cookieStore.set('returnUrl', pathname);
}
