import { localStorageYearData, localStorageSetYearData } from "./YearData"

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

export interface SyncMetadata {
  lastSync: number
  lastLocalChange: number
  userId: string
  year: number
}

export class SyncManager {
  private static instance: SyncManager
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map()
  private syncStatus: SyncStatus = 'idle'
  private lastError: string | null = null
  private pageLoadPulls: Set<string> = new Set() // Track which user/year combinations have been pulled on page load

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager()
    }
    return SyncManager.instance
  }

  /**
   * Force pull from database (used on page load)
   */
  async forcePullFromDatabase(userId: string, year: number): Promise<void> {
    const key = `${userId}-${year}`
    
    // Only pull once per page load per user/year combination
    if (this.pageLoadPulls.has(key)) {
      console.log(`Already pulled from database for ${key} on this page load`)
      return
    }
    
    try {
      console.log(`Force pulling from database for ${key} on page load`)
      this.setSyncStatus('syncing')
      await this.pullFromCloud(userId, year)
      this.pageLoadPulls.add(key)
      this.setSyncStatus('success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Database pull failed'
      console.error(`Force pull error for ${key}:`, error)
      this.setSyncStatus('error', errorMessage)
      throw error
    }
  }

  /**
   * Clear page load pull tracking (useful for testing or manual refresh)
   */
  clearPageLoadTracking(): void {
    this.pageLoadPulls.clear()
  }

  /**
   * Start automatic sync for a user/year combination
   */
  startAutoSync(userId: string, year: number): void {
    const key = `${userId}-${year}`
    
    // Clear existing interval if any
    this.stopAutoSync(userId, year)
    
    // Start new interval
    const interval = setInterval(() => {
      this.performSync(userId, year)
    }, 10000) // 10 seconds
    
    this.syncIntervals.set(key, interval)
    console.log(`Started auto-sync for ${key}`)
  }

  /**
   * Stop automatic sync for a user/year combination
   */
  stopAutoSync(userId: string, year: number): void {
    const key = `${userId}-${year}`
    const interval = this.syncIntervals.get(key)
    
    if (interval) {
      clearInterval(interval)
      this.syncIntervals.delete(key)
      console.log(`Stopped auto-sync for ${key}`)
    }
  }

  /**
   * Stop all auto-sync intervals
   */
  stopAllAutoSync(): void {
    this.syncIntervals.forEach((interval) => {
      clearInterval(interval)
    })
    this.syncIntervals.clear()
    console.log('Stopped all auto-sync intervals')
  }

  /**
   * Get sync metadata for a specific user and year
   */
  private getSyncMetadata(userId: string, year: number): SyncMetadata {
    const key = `sync-metadata-${userId}-${year}`
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : {
      lastSync: 0,
      lastLocalChange: 0,
      userId,
      year
    }
  }

  /**
   * Save sync metadata
   */
  private saveSyncMetadata(metadata: SyncMetadata): void {
    const key = `sync-metadata-${metadata.userId}-${metadata.year}`
    localStorage.setItem(key, JSON.stringify(metadata))
  }

  /**
   * Check if local data has changed since last sync
   */
  private hasLocalChanges(userId: string, year: number): boolean {
    const dataHash = this.getDataHash(userId, year)
    const lastHash = localStorage.getItem(`data-hash-${userId}-${year}`)
    
    // If no last hash exists, check if we have any data
    if (!lastHash) {
      const data = localStorageYearData(userId, year)
      const hasData = data && (
        Object.keys(data.notes || {}).length > 0 || 
        (data.months && data.months.some(month => 
          month.topics && month.topics.some(topic => 
            topic.name || (topic.events && topic.events.length > 0)
          )
        ))
      )
      return hasData
    }
    
    return dataHash !== lastHash
  }

  /**
   * Generate hash of current data for change detection
   */
  private getDataHash(userId: string, year: number): string {
    const data = localStorageYearData(userId, year)
    const jsonString = JSON.stringify(data)
    
    // Simple hash function that works with Unicode characters
    let hash = 0
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36).slice(0, 16)
  }

  /**
   * Save current data hash
   */
  private saveDataHash(userId: string, year: number): void {
    const hash = this.getDataHash(userId, year)
    localStorage.setItem(`data-hash-${userId}-${year}`, hash)
  }

  /**
   * Perform the actual sync operation
   */
  private async performSync(userId: string, year: number): Promise<void> {
    try {
      this.setSyncStatus('syncing')
      
      const hasLocalChanges = this.hasLocalChanges(userId, year)
      console.log(`Sync for ${userId}-${year}:`, { hasLocalChanges })
      
      if (hasLocalChanges) {
        // Push local changes to cloud
        await this.pushToCloud(userId, year)
      } else {
        // Pull from cloud
        await this.pullFromCloud(userId, year)
      }
      
      this.setSyncStatus('success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed'
      console.error(`Sync error for ${userId}-${year}:`, error)
      this.setSyncStatus('error', errorMessage)
    }
  }

  /**
   * Push local data to cloud database
   */
  private async pushToCloud(userId: string, year: number): Promise<void> {
    console.log(`Pushing to cloud: ${userId}-${year}`)
    
    const data = localStorageYearData(userId, year)
    
    const response = await fetch('/api/calendar-data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        year,
        data,
        force: true // Force overwrite, no conflict check
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required - please sign in')
      }
      throw new Error(`Push failed: ${response.status} ${response.statusText}`)
    }

    await response.json()
    
    // Update metadata
    const metadata = this.getSyncMetadata(userId, year)
    metadata.lastSync = Date.now()
    metadata.lastLocalChange = Date.now()
    this.saveSyncMetadata(metadata)
    this.saveDataHash(userId, year)
  }

  /**
   * Pull data from cloud database
   */
  private async pullFromCloud(userId: string, year: number): Promise<void> {
    console.log(`Pulling from cloud: ${userId}-${year}`)
    
    const response = await fetch(`/api/calendar-data?year=${year}`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required - please sign in')
      }
      if (response.status === 404) {
        // No data on server, nothing to pull
        console.log(`No data on server: ${userId}-${year}`)
        return
      }
      throw new Error(`Pull failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log(`Pull success: ${userId}-${year}`)
    
    // Update local data
    localStorageSetYearData(userId, year, result.data)
    
    // Update metadata
    const metadata = this.getSyncMetadata(userId, year)
    metadata.lastSync = Date.now()
    this.saveSyncMetadata(metadata)
    this.saveDataHash(userId, year)
  }

  /**
   * Manual sync trigger
   */
  async manualSync(userId: string, year: number): Promise<boolean> {
    try {
      await this.performSync(userId, year)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get current sync status
   */
  getStatus(): { status: SyncStatus; error: string | null } {
    return { status: this.syncStatus, error: this.lastError }
  }

  /**
   * Set sync status
   */
  private setSyncStatus(status: SyncStatus, error?: string): void {
    this.syncStatus = status
    this.lastError = error || null
  }

  /**
   * Get sync info for display
   */
  getSyncInfo(userId: string, year: number): {
    lastSync: Date | null
    hasChanges: boolean
    isAutoSyncing: boolean
  } {
    const metadata = this.getSyncMetadata(userId, year)
    const key = `${userId}-${year}`
    
    return {
      lastSync: metadata.lastSync > 0 ? new Date(metadata.lastSync) : null,
      hasChanges: this.hasLocalChanges(userId, year),
      isAutoSyncing: this.syncIntervals.has(key)
    }
  }
}

// Export singleton instance
export const syncManager = SyncManager.getInstance() 