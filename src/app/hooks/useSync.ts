"use client"

import { useState, useEffect, useCallback } from "react"
import { syncManager, type SyncStatus } from "../utils/SyncManager"
import { useSessionUser } from "./useSessionUser"

export function useSync(year: number) {
  const user = useSessionUser()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // Update sync status when it changes
  useEffect(() => {
    const updateStatus = () => {
      const status = syncManager.getStatus()
      setSyncStatus(status.status)
      setError(status.error)
      setIsSyncing(status.status === 'syncing')
    }

    // Update immediately
    updateStatus()

    // Set up polling for status updates
    const interval = setInterval(updateStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  // Start auto-sync when user is available
  useEffect(() => {
    if (user?.id) {
      console.log(`Starting auto-sync for user ${user.id}, year ${year}`)
      
      // Clear page load tracking when year changes
      syncManager.clearPageLoadTracking()
      
      // Force pull from database on page load
      const forcePullOnLoad = async () => {
        try {
          await syncManager.forcePullFromDatabase(user.id, year)
        } catch (error) {
          console.error('Failed to pull from database on page load:', error)
          // Don't throw - let the app continue with local data
        }
      }
      
      // Pull immediately on page load
      forcePullOnLoad()
      
      // Start regular auto-sync
      syncManager.startAutoSync(user.id, year)
      
      // Cleanup on unmount
      return () => {
        console.log(`Stopping auto-sync for user ${user.id}, year ${year}`)
        syncManager.stopAutoSync(user.id, year)
      }
    }
  }, [user?.id, year])

  // Manual sync trigger
  const manualSync = useCallback(async () => {
    if (!user?.id) {
      setError("Please sign in to sync your data")
      return false
    }

    try {
      setIsSyncing(true)
      setError(null)
      const success = await syncManager.manualSync(user.id, year)
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Manual sync failed")
      return false
    } finally {
      setIsSyncing(false)
    }
  }, [user?.id, year])

  // Get sync information
  const getSyncInfo = useCallback(() => {
    if (!user?.id) return null
    return syncManager.getSyncInfo(user.id, year)
  }, [user?.id, year])

  return {
    // State
    syncStatus,
    error,
    isSyncing,
    
    // Actions
    manualSync,
    
    // Info
    getSyncInfo,
    
    // Utilities
    isOnline: navigator.onLine,
    canSync: user?.id && navigator.onLine
  }
} 