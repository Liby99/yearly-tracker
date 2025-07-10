"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"

interface RemoveAccountProps {
  isOpen: boolean
  onClose: () => void
}

export default function RemoveAccount({ isOpen, onClose }: RemoveAccountProps) {
  const { data: session } = useSession()
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [step, setStep] = useState<"warning" | "password" | "confirm">("warning")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPassword("")
      setPasswordConfirm("")
      setStep("warning")
      setError("")
    }
  }, [isOpen])

  const handleWarningConfirm = () => {
    setStep("password")
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setIsLoading(true)
    setError("")
    
    try {
      // Verify password by attempting to sign in
      const res = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: session?.user?.email, 
          password 
        })
      })
      
      if (res.ok) {
        setStep("confirm")
      } else {
        setError("Incorrect password")
      }
    } catch {
      setError("Failed to verify password. Please try again.")
    }
    
    setIsLoading(false)
  }

  const handleFinalConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordConfirm) return

    if (password !== passwordConfirm) {
      setError("Passwords don't match")
      return
    }

    setIsLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/auth/remove-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: session?.user?.email,
          password 
        })
      })
      
      if (res.ok) {
        // Sign out and redirect
        signOut({ callbackUrl: "/" })
      } else {
        const data = await res.json()
        setError(data.error || "Failed to remove account")
      }
    } catch {
      setError("Failed to remove account. Please try again.")
    }
    
    setIsLoading(false)
  }

  const goBackToWarning = () => {
    setStep("warning")
    setPassword("")
    setPasswordConfirm("")
    setError("")
  }

  const goBackToPassword = () => {
    setStep("password")
    setPasswordConfirm("")
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay screen-only" onClick={onClose}>
      <div className="modal-content screen-only" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>
            {step === "warning" && "Remove Account"}
            {step === "password" && "Enter Password"}
            {step === "confirm" && "Final Confirmation"}
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
            {step === "warning" && (
              <div>
                <div className="setting-item">
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <i className="fa fa-exclamation-triangle" style={{ fontSize: "48px", color: "#e74c3c", marginBottom: "15px" }}></i>
                    <h3 style={{ color: "#e74c3c", margin: "10px 0" }}>⚠️ Warning: This action cannot be undone!</h3>
                  </div>
                  <p className="help-description" style={{ textAlign: "left", lineHeight: "1.6" }}>
                    <strong>Removing your account will permanently delete:</strong>
                  </p>
                  <ul style={{ textAlign: "left", margin: "15px 0", paddingLeft: "20px" }}>
                    <li>All your calendar data and events</li>
                    <li>All your monthly topics and notes</li>
                    <li>All your quarterly notes</li>
                    <li>Your user account and profile</li>
                    <li>All associated settings and preferences</li>
                  </ul>
                  <p className="help-description" style={{ color: "#e74c3c", fontWeight: "bold" }}>
                    This action is irreversible. Please make sure you have backed up any important data.
                  </p>
                </div>

                <div className="setting-item">
                  <button
                    type="button"
                    onClick={handleWarningConfirm}
                    className="setting-button danger"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    I understand, continue to remove account
                  </button>
                </div>
              </div>
            )}

            {step === "password" && (
              <form onSubmit={handlePasswordSubmit}>
                <div className="setting-item">
                  <label>
                    <i className="fa fa-user" style={{ marginRight: 5 }}></i>
                    <span className="font-medium">Your email: </span>
                    <span className="font-medium">{session?.user?.email}</span>
                    <button
                      type="button"
                      onClick={goBackToWarning}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="setting-input"
                    placeholder="Enter your password to continue"
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
                    className="setting-button danger"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {isLoading ? "Verifying..." : "Continue"}
                  </button>
                </div>
              </form>
            )}

            {step === "confirm" && (
              <form onSubmit={handleFinalConfirm}>
                <div className="setting-item">
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <i className="fa fa-check-circle" style={{ fontSize: "32px", color: "#27ae60", marginBottom: "10px" }}></i>
                    <p className="font-medium">Password verified</p>
                  </div>
                  <p className="help-description" style={{ color: "#e74c3c", fontWeight: "bold", textAlign: "center" }}>
                    This is your final chance to cancel. Type your password again to permanently remove your account.
                  </p>
                  <button
                    type="button"
                    onClick={goBackToPassword}
                    className="font-medium"
                    style={{ marginTop: 10, color: "var(--accent-dark)", textDecoration: "underline", fontSize: 12, cursor: "pointer" }}
                  >
                    <i className="fa fa-arrow-left" style={{ marginRight: 5 }}></i>
                    Go back
                  </button>
                </div>
                
                <div className="setting-item">
                  <input
                    type="password"
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="setting-input"
                    placeholder="Type your password again to confirm"
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
                    className="setting-button danger"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {isLoading ? "Removing account..." : "Permanently remove my account"}
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