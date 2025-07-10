"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

interface UserAccountDropdownProps {
  onChangePassword: () => void
  onRemoveAccount: () => void
  onSignIn?: () => void
}

export default function UserAccountDropdown({ onChangePassword, onRemoveAccount, onSignIn }: UserAccountDropdownProps) {
  const { data: session } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  if (!session) {
    return (
      <button className="save-upload-button" onClick={onSignIn}>
        <i className="fa fa-sign-in" style={{marginRight: 5}}></i>
        Sign In
      </button>
    )
  }

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <span
        className="save-upload-button user-dropdown-toggle"
        onClick={() => setShowDropdown((v) => !v)}
        title="Account Menu"
      >
        <i className="fa fa-user" style={{marginRight: 5}}></i>
        {session.user?.name || session.user?.email}
        <i className="fa fa-chevron-down"></i>
      </span>
      {showDropdown && (
        <div className="user-dropdown">
          <div
            className="dropdown-item"
            onClick={() => {
              onChangePassword()
              setShowDropdown(false)
            }}
          >
            <i className="fa fa-key dropdown-item-icon"></i>
            Change Password
          </div>
          <div
            className="dropdown-item"
            onClick={() => {
              signOut()
              setShowDropdown(false)
            }}
          >
            <i className="fa fa-sign-out dropdown-item-icon"></i>
            Sign Out
          </div>
          <div
            className="dropdown-item danger"
            onClick={() => {
              onRemoveAccount()
              setShowDropdown(false)
            }}
          >
            <i className="fa fa-trash dropdown-item-icon"></i>
            Remove Account
          </div>
        </div>
      )}
    </div>
  )
} 