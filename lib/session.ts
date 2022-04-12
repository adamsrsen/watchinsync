import type { IronSessionOptions } from 'iron-session'
import type User from '../objects/User'

export const sessionOptions: IronSessionOptions = {
  password: process.env.COOKIE_SECRET,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}