import Google from '@auth/core/providers/google'
import { type SolidAuthConfig } from '@solid-mediakit/auth/types'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { users } from '~/db/schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import env from '~/config/env'

declare module '@auth/core/types' {
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession['user']
  }
}

export const authOptions: SolidAuthConfig = {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const [user] = await db.select().from(users).where(eq(users.id, session.user.id))
      if (user.role) {
        session.user.role = user.role
      } else {
        await db.update(users).set({ role: 'user' }).where(eq(users.id, session.user.id))
        session.user.role = user.role
      }
      return session
    },
  },
  debug: false,
  basePath: import.meta.env.VITE_AUTH_PATH,
  trustHost: true,
  session: { strategy: 'database' },
  adapter: DrizzleAdapter(db),
}
