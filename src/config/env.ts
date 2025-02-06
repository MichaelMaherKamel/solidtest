// ~/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  // Database configuration
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // Supabase configuration
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),

  // Fawry payment configuration
  FAWRY_MERCHANT_CODE: z.string().min(1, 'FAWRY_MERCHANT_CODE is required'),
  FAWRY_SECURITY_CODE: z.string().min(1, 'FAWRY_SECURITY_CODE is required'),

  // Auth configuration
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  AUTH_PATH: z.string().default('/api/auth'),

  // Public configuration
  PUBLIC_URL: z.string().url('PUBLIC_URL must be a valid URL').optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Type for our validated environment
export type EnvConfig = z.infer<typeof envSchema>

function createValidatedEnv(): EnvConfig {
  try {
    // Use import.meta.env in client, process.env in server
    const envSource = typeof process !== 'undefined' ? process.env : import.meta.env

    const env = envSchema.parse(envSource)
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path}: ${err.message}`).join('\n')
      console.error('❌ Invalid environment variables:\n', errors)
      throw new Error('Invalid environment configuration')
    }
    console.error('❌ Unknown error validating environment variables:', error)
    throw error
  }
}

export const env = createValidatedEnv()

export default env
