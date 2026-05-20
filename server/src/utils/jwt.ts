import jwt from 'jsonwebtoken'
import { JwtPayload, UserRole } from '../types'

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')
  return secret
}

export const signToken = (id: string, role: UserRole): string => {
  return jwt.sign({ id, role }, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'],
  })
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret()) as JwtPayload
}
