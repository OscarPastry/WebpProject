import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET || 'super-secret-jwt-key'
const key = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  userId: number;
  username: string;
  expires: string | Date;
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload as unknown as import('jose').JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
    try {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function setSession(userId: number, username: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, username, expires })
  
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    expires,
    httpOnly: true,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', {
    expires: new Date(0)
  });
}
