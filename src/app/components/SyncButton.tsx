"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { syncToDatabase, syncFromDatabase, getLocalStorageData, setLocalStorageData, SyncStatus } from "../utils/SyncManager"

interface SyncButtonProps {
  year: number
}

export default function SyncButton({ year }: SyncButtonProps) {
  const { data: session } = useSession()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSynced: false,
    lastSync: null,
    hasLocalChanges: false,
  })
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      // Check sync status when user logs in
      checkSyncStatus()
    }
  }, [session, year])

  const checkSyncStatus = async () => {
    if (!session?.user?.id) return

    // For now, we'll assume there are local changes
    // In a real implementation, you'd compare timestamps
    setSyncStatus({
      isSynced: false,
      lastSync: null,
      hasLocalChanges: true,
    })
  }

  const handleSync = async () => {
    if (!session?.user?.id || isSyncing) return

    setIsSyncing(true)
    try {
      // Get local data
      const localData = getLocalStorageData(year)
      
      if (localData) {
        // Sync local data to database
        const result = await syncToDatabase(session.user.id, year, localData)
        if (result.success) {
          setSyncStatus({
            isSynced: true,
            lastSync: new Date(),
            hasLocalChanges: false,
          })
        }
      } else {
        // Try to sync from database to local
        const result = await syncFromDatabase(session.user.id, year)
        if (result.success && result.data) {
          setLocalStorageData(year, result.data)
          setSyncStatus({
            isSynced: true,
            lastSync: new Date(),
            hasLocalChanges: false,
          })
          // Reload the page to reflect synced data
          window.location.reload()
        }
      }
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  if (!session) return null

  return (
    <button 
      className="save-upload-button" 
      onClick={handleSync}
      disabled={isSyncing}
      title={syncStatus.hasLocalChanges ? "Sync local changes to cloud" : "Sync from cloud"}
    >
      <i 
        className={`fa ${syncStatus.hasLocalChanges ? 'fa-cloud-upload' : 'fa-cloud-download'}`} 
        style={{marginRight: 5}}
      />
      {isSyncing ? "Syncing..." : "Sync"}
    </button>
  )
} 