import { SignJWT, jwtVerify } from 'jose';

const ACCESS_SECRET = Uint8Array.from(
  Buffer.from(process.env.ACCESS_SECRET as string, 'base64')
);

export async function generateAccessToken(payload: any, exp = '1h') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(exp)
    .sign(ACCESS_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
}
