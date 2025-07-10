"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { data: session } = useSession()
  const [oldPassword, setOldPassword] = useState("")
  const [oldPasswordConfirm, setOldPasswordConfirm] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [step, setStep] = useState<"old-password" | "old-confirm" | "new-password">("old-password")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setOldPassword("")
      setOldPasswordConfirm("")
      setNewPassword("")
      setStep("old-password")
      setError("")
    }
  }, [isOpen])

  const handleOldPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword) return

    setIsLoading(true)
    setError("")
    
    try {
      // Verify old password by attempting to sign in
      const res = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: session?.user?.email, 
          password: oldPassword 
        })
      })
      
      if (res.ok) {
        setStep("old-confirm")
      } else {
        setError("Incorrect password")
      }
    } catch {
      setError("Failed to verify password. Please try again.")
    }
    
    setIsLoading(false)
  }

  const handleOldPasswordConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPasswordConfirm) return

    if (oldPassword !== oldPasswordConfirm) {
      setError("Passwords don't match")
      return
    }

    setStep("new-password")
    setError("")
  }

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword) return

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: session?.user?.email,
          oldPassword,
          newPassword 
        })
      })
      
      if (res.ok) {
        onClose()
        // Optionally show success message or reload
        window.location.reload()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to change password")
      }
    } catch {
      setError("Failed to change password. Please try again.")
    }
    
    setIsLoading(false)
  }

  const goBackToOldPassword = () => {
    setStep("old-password")
    setOldPassword("")
    setOldPasswordConfirm("")
    setError("")
  }

  const goBackToOldConfirm = () => {
    setStep("old-confirm")
    setOldPasswordConfirm("")
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay screen-only" onClick={onClose}>
      <div className="modal-content screen-only" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>
            {step === "old-password" && "Enter your current password"}
            {step === "old-confirm" && "Confirm your current password"}
            {step === "new-password" && "Enter your new password"}
          </h2>
          <button 
            className="modal-close-button"
            onClick={onClose}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="setting-section" style={{ textAlign: "center", margin: "0 auto", paddingBottom: 25, width: "70%" }}>
            {step === "old-password" && (
              <form onSubmit={handleOldPasswordSubmit}>
                <div className="setting-item">
                  <label>
                    <i className="fa fa-user" style={{ marginRight: 5 }}></i>
                    <span className="font-medium">Your email: </span>
                    <span className="font-medium">{session?.user?.email}</span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="setting-input"
                    placeholder="Current password"
                  />
                </div>

                {error && (
                  <div className="setting-item">
                    <p className="help-description" style={{ color: "red", textAlign: "center" }}>
                      {error}
                    </p>
                  </div>
                )}

                <div className="setting-item">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="setting-button"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {isLoading ? "Verifying..." : "Continue"}
                  </button>
                </div>
              </form>
            )}

            {step === "old-confirm" && (
              <form onSubmit={handleOldPasswordConfirm}>
                <div className="setting-item">
                  <label>
                    <i className="fa fa-lock" style={{ marginRight: 5 }}></i>
                    <span className="font-medium">Current password: </span>
                    <span className="font-medium">{"•".repeat(oldPassword.length)}</span>
                    <button
                      type="button"
                      onClick={goBackToOldPassword}
                      className="font-medium"
                      style={{ marginLeft: 10, color: "var(--accent-dark)", textDecoration: "underline", fontSize: 12, cursor: "pointer" }}
                    >
                      <i className="fa fa-pencil" style={{ marginRight: 5 }}></i>
                      Change
                    </button>
                  </label>
                </div>
                
                <div className="setting-item">
                  <input
                    type="password"
                    required
                    value={oldPasswordConfirm}
                    onChange={(e) => setOldPasswordConfirm(e.target.value)}
                    className="setting-input"
                    placeholder="Confirm current password"
                  />
                </div>

                {error && (
                  <div className="setting-item">
                    <p className="help-description" style={{ color: "red", textAlign: "center" }}>
                      {error}
                    </p>
                  </div>
                )}

                <div className="setting-item">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="setting-button"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    Confirm
                  </button>
                </div>
              </form>
            )}

            {step === "new-password" && (
              <form onSubmit={handleNewPasswordSubmit}>
                <div className="setting-item">
                  <label>
                    <i className="fa fa-check" style={{ marginRight: 5 }}></i>
                    <span className="font-medium">Current password verified</span>
                    <button
                      type="button"
                      onClick={goBackToOldConfirm}
                      className="font-medium"
                      style={{ marginLeft: 10, color: "var(--accent-dark)", textDecoration: "underline", fontSize: 12, cursor: "pointer" }}
                    >
                      <i className="fa fa-arrow-left" style={{ marginRight: 5 }}></i>
                      Back
                    </button>
                  </label>
                </div>
                
                <div className="setting-item">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="setting-input"
                    placeholder="New password (minimum 6 characters)"
                  />
                </div>

                {error && (
                  <div className="setting-item">
                    <p className="help-description" style={{ color: "red", textAlign: "center" }}>
                      {error}
                    </p>
                  </div>
                )}

                <div className="setting-item">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="setting-button"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {isLoading ? "Changing password..." : "Change password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 