// lib/session.ts
import { useSession } from 'vinxi/http'

export type UserSession = {
  userId?: string
  userRole?: string
}

const SESSION_CONFIG = {
  password: process.env.SESSION_SECRET || 'default-secret-change-me'
} as const

export async function getSession() {
  return useSession<UserSession>(SESSION_CONFIG)
}

export async function updateSessionUser(userId: string | undefined, userRole: string | undefined) {
  const session = await getSession()
  await session.update(() => ({
    userId,
    userRole
  }))
}

export async function getSessionUser() {
  const session = await getSession()
  return {
    userId: session.data.userId,
    userRole: session.data.userRole
  }
}