import { useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { NavMenuProps } from "./NavMenu"

export default function MobileNavMenu({
  setShowSettings,
  setShowHelp,
  setShowSignIn,
  setShowChangePassword,
  setShowRemoveAccount,
}: NavMenuProps) {
  const { data: session } = useSession();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  return (
    <span className="mobile-nav-menu show-mobile-only" style={{ position: "relative" }}>
      <button
        className="save-upload-button"
        style={{ fontSize: 20, padding: 6 }}
        onClick={() => setShowMobileMenu((v) => !v)}
        aria-label="Menu"
      >
        <i className="fa fa-bars"></i>
      </button>
      {showMobileMenu && (
        <div
          className="user-dropdown"
          ref={mobileMenuRef}
          style={{ right: 0, left: "auto", minWidth: 220, zIndex: 1000 }}
        >
          <div
            className="dropdown-item dropdown-item-big"
            onClick={() => {
              setShowSettings(true);
              setShowMobileMenu(false);
            }}
          >
            <i className="fa fa-cog dropdown-item-icon fa-margin-right"></i>
            Settings
          </div>
          <div
            className="dropdown-item dropdown-item-big"
            onClick={() => {
              setShowHelp(true);
              setShowMobileMenu(false);
            }}
          >
            <i className="fa fa-question-circle dropdown-item-icon fa-margin-right"></i>
            Help
          </div>
          {!session && (
            <div
              className="dropdown-item dropdown-item-big"
              onClick={() => {
                setShowSignIn(true);
                setShowMobileMenu(false);
              }}
            >
              <i className="fa fa-sign-in dropdown-item-icon fa-margin-right"></i>
              Sign In
            </div>
          )}
          {session && (
            <>
              <div
                className="dropdown-item dropdown-item-big"
                onClick={() => {
                  setShowChangePassword(true);
                  setShowMobileMenu(false);
                }}
              >
                <i className="fa fa-key dropdown-item-icon fa-margin-right"></i>
                Change Pwd
              </div>
              <div
                className="dropdown-item dropdown-item-big"
                onClick={() => {
                  if (confirm("Are you sure you want to sign out?")) {
                    signOut();
                    setShowMobileMenu(false);
                  }
                }}
              >
                <i className="fa fa-sign-out dropdown-item-icon fa-margin-right"></i>
                Sign Out
              </div>
              <div
                className="dropdown-item dropdown-item-big danger"
                onClick={() => {
                  setShowRemoveAccount(true);
                  setShowMobileMenu(false);
                }}
              >
                <i className="fa fa-trash dropdown-item-icon fa-margin-right"></i>
                Remove Account
              </div>
            </>
          )}
        </div>
      )}
    </span>
  )
}
