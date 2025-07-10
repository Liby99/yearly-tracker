"use client"

import React, { useState } from "react"
import { useSync } from "../hooks/useSync"
import { useSessionUser } from "../hooks/useSessionUser"

interface SyncButtonProps {
  year: number,
  className?: string,
  showStatus?: boolean,
}

export default function SyncButton({ 
  year, 
  className = "", 
  showStatus = true
}: SyncButtonProps) {
  const user = useSessionUser()
  const { 
    syncStatus, 
    error, 
    isSyncing, 
    manualSync,
    getSyncInfo,
    isOnline
  } = useSync(year)

  const [showError, setShowError] = useState(false)
  const syncInfo = getSyncInfo()

  // Show error when it changes
  React.useEffect(() => {
    if (error) {
      setShowError(true)
    }
  }, [error])

  const handleManualSync = async () => {
    if (!user?.id) {
      return
    }
    await manualSync()
  }

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <i className="fa fa-spinner fa-spin" />
      case 'success':
        return <i className="fa fa-check" />
      case 'error':
        return <i className="fa fa-exclamation-triangle" />
      default:
        return <i className="fa fa-cloud" />
    }
  }

  const getStatusText = () => {
    if (!user?.id) return 'Sign In'
    
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...'
      case 'success':
        return 'Synced'
      case 'error':
        return 'Error'
      default:
        return 'Auto-Sync'
    }
  }

  const getButtonClass = () => {
    let baseClass = `sync-button ${className}`
    
    if (!user?.id) baseClass += ' auth-required'
    if (isSyncing) baseClass += ' syncing'
    if (error) baseClass += ' error'
    if (!isOnline) baseClass += ' offline'
    
    return baseClass
  }

  return (
    <>
      <button
        className={getButtonClass()}
        onClick={handleManualSync}
        disabled={!user?.id || isSyncing}
        title={error || getStatusText()}
      >
        {getStatusIcon()}
        {showStatus && <span className="sync-text">{getStatusText()}</span>}
      </button>

      {/* Error Message Display */}
      {error && showError && (
        <div className="sync-error-message">
          <i className="fa fa-exclamation-triangle" />
          <span>{error}</span>
          <button 
            onClick={() => setShowError(false)}
            className="sync-error-close"
            title="Dismiss error"
          >
            <i className="fa fa-times" />
          </button>
        </div>
      )}

      {/* Sync Info Tooltip */}
      {showStatus && syncInfo && user?.id && (
        <div className="sync-info">
          {syncInfo.lastSync && (
            <div className="sync-info-item">
              <i className="fa fa-clock-o" />
              <span>Last sync: {syncInfo.lastSync.toLocaleString()}</span>
            </div>
          )}
          {syncInfo.hasChanges && (
            <div className="sync-info-item">
              <i className="fa fa-pencil" />
              <span>Local changes pending</span>
            </div>
          )}
          <div className="sync-info-item">
            <i className="fa fa-refresh" />
            <span>Auto-sync: {syncInfo.isAutoSyncing ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      )}
    </>
  )
} 