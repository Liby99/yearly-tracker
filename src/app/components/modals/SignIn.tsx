"use client"

import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"

interface SignInProps {
  isOpen: boolean
  onClose: () => void
}

export default function SignIn({ isOpen, onClose }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        onClose();
      }
    });
  }, [onClose])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setStep("email");
      setError("");
      setUserExists(false);
    }
  }, [isOpen])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      setUserExists(data.exists)
      setStep("password")
    } catch {
      setError("Failed to check email. Please try again.")
    }
    
    setIsLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsLoading(true);
    setError("");
    
    if (userExists) {
      // Sign in existing user
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // reload the page
        window.location.reload();
      } else {
        setError("Invalid password");
      }
    } else {
      // Create new account
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        })
        
        if (res.ok) {
          // Auto sign in after registration
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          })
          
          if (result?.ok) {
            onClose()
          }
        } else {
          const data = await res.json()
          setError(data.error || "Registration failed")
        }
      } catch {
        setError("Registration failed. Please try again.")
      }
    }
    
    setIsLoading(false)
  }

  const goBackToEmail = () => {
    setStep("email")
    setPassword("")
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay screen-only" onClick={onClose}>
      <div className="modal-content screen-only" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>
            {step === "email" ? "Enter your email" : userExists ? "Welcome back!" : "Create your account"}
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
            {step === "email" ? (
              <form onSubmit={handleEmailSubmit}>
                <div className="setting-item">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="setting-input"
                    placeholder="Email address"
                  />
                </div>

                <div className="setting-item">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="setting-button"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {isLoading ? "Checking..." : "Continue"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <div className="setting-item">
                  <label>
                    <i className="fa fa-envelope" style={{ marginRight: 5 }}></i>
                    <span className="font-medium">Your email: </span>
                    <span className="font-medium">{email}</span>
                    <button
                      type="button"
                      onClick={goBackToEmail}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="setting-input"
                    placeholder="Password"
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
                    {isLoading 
                      ? (userExists ? "Signing in..." : "Creating account...") 
                      : (userExists ? "Sign in" : "Create account")
                    }
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