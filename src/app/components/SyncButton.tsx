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

      <style jsx>{`
        .sync-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .sync-button:hover:not(:disabled) {
          background: #f5f5f5;
        }

        .sync-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .sync-button.auth-required {
          background: #e3f2fd;
          border-color: #2196f3;
          color: #1976d2;
        }

        .sync-button.auth-required:hover {
          background: #bbdefb;
        }

        .sync-button.syncing {
          background: #fff3e0;
          border-color: #ff9800;
        }

        .sync-button.error {
          background: #ffebee;
          border-color: #f44336;
          color: #d32f2f;
        }

        .sync-button.offline {
          background: #f5f5f5;
          border-color: #9e9e9e;
          color: #616161;
        }

        .sync-text {
          font-weight: 500;
        }

        .sync-error-message {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffebee;
          border: 1px solid #f44336;
          border-radius: 4px;
          padding: 8px 12px;
          margin-top: 4px;
          font-size: 12px;
          color: #d32f2f;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          max-width: 300px;
        }

        .sync-error-message span {
          flex: 1;
          word-wrap: break-word;
        }

        .sync-error-close {
          background: none;
          border: none;
          color: #d32f2f;
          cursor: pointer;
          padding: 2px;
          font-size: 10px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .sync-error-close:hover {
          opacity: 1;
        }

        .sync-info {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px;
          font-size: 12px;
          color: #666;
          white-space: nowrap;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: none;
        }

        .sync-button:hover .sync-info {
          display: block;
        }

        .sync-info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .sync-info-item:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </>
  )
} 