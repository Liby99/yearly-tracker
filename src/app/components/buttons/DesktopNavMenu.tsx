"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

import { NavMenuProps } from "./NavMenu"

export default function DesktopNavMenu({ 
  setShowSettings,
  setShowHelp,
  setShowSignIn,
  setShowChangePassword,
  setShowRemoveAccount,
}: NavMenuProps) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  return (
    <span className="nav-menu screen-only no-show-mobile">
      <button className="save-upload-button" onClick={() => window.print()}>
        <i className="fa fa-print fa-margin-right"></i>
        Print
      </button>
      <span className="nav-separator">|</span>
      <button className="save-upload-button" onClick={() => setShowSettings(true)}>
        <i className="fa fa-cog fa-margin-right"></i>
        Settings
      </button>
      <span className="nav-separator">|</span>
      <button className="save-upload-button" onClick={() => setShowHelp(true)}>
        <i className="fa fa-question-circle fa-margin-right"></i>
        Help
      </button>
    <span className="nav-separator">|</span>

    {/* User account dropdown */}
    {session && (
      <div className="user-dropdown-container" ref={dropdownRef}>
        <span
          className="save-upload-button user-dropdown-toggle"
          onClick={() => setShowDropdown((v) => !v)}
          title="Account Menu"
        >
          <i className="fa fa-user fa-margin-right"></i>
          {session.user?.name || session.user?.email}
          <i className="fa fa-chevron-down"></i>
        </span>
        {showDropdown && (
          <div className="user-dropdown">
            <div
              className="dropdown-item"
              onClick={() => {
                setShowChangePassword(true);
                setShowDropdown(false);
              }}
            >
              <i className="fa fa-key dropdown-item-icon"></i>
              Change Password
            </div>
            <div
              className="dropdown-item"
              onClick={() => {
                if (confirm("Are you sure you want to sign out?")) {
                  signOut();
                  setShowDropdown(false);
                }
              }}
            >
              <i className="fa fa-sign-out dropdown-item-icon"></i>
              Sign Out
            </div>
            <div
              className="dropdown-item danger"
              onClick={() => {
                setShowRemoveAccount(true);
                setShowDropdown(false);
              }}
            >
              <i className="fa fa-trash dropdown-item-icon"></i>
              Remove Account
            </div>
          </div>
          )}
        </div>
      )}

      {/* Sign in button */}
      {!session && (
        <button className="save-upload-button" onClick={() => setShowSignIn(true)}>
          <i className="fa fa-sign-in fa-margin-right"></i>
          Sign In
        </button>
      )}
    </span>
  )
}
