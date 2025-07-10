"use client"

import { useSession } from "next-auth/react"
import type { SessionUser } from "../utils/SessionUser.tsx"

/**
 * Custom hook that converts NextAuth session to SessionUser type
 * Returns the current user if authenticated, undefined otherwise
 */
export function useSessionUser() : SessionUser | undefined {
  const { data: session, status } = useSession()

  // Return undefined if session is loading or not authenticated
  if (status === "loading" || !session?.user) {
    return undefined
  }

  // Convert NextAuth session user to SessionUser type
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: (session.user as any).id,
    email: session.user.email || "",
  }
}

export type { SessionUser } 