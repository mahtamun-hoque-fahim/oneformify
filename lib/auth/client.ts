'use client'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
})

// Re-export convenience methods for direct import
export const { signIn, signUp, signOut, useSession } = authClient
