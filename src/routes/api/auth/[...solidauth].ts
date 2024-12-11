import { SolidAuth } from '@solid-mediakit/auth'
import { authOptions } from '~/lib/auth/authOptions'

export const { GET, POST } = SolidAuth(authOptions)
