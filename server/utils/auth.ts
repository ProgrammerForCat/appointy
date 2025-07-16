import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { JWTPayload } from './types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// パスワードをハッシュ化
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// パスワードを検証
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWTトークンを生成
export function generateToken(payload: Omit<JWTPayload, 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// JWTトークンを検証
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}


// Cookieからトークンを取得
export function getTokenFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
  const authCookie = cookies.find(cookie => cookie.startsWith('auth-token='))
  
  if (!authCookie) return null
  
  return authCookie.split('=')[1]
}

// 認証用のミドルウェア
export async function requireAuth(event: any): Promise<JWTPayload | null> {
  // getCookieヘルパーを使用
  const token = getCookie(event, 'auth-token')
  
  if (!token) {
    return null
  }
  
  const payload = verifyToken(token)
  return payload
}