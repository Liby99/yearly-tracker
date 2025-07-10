import { useRef, useState, useEffect } from "react";
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

  // Mobile menu show/hide states
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!showMobileMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMobileMenu]);

  return (
    <span className="mobile-nav-menu show-mobile-only">
      {/* Menu button */}
      <button className="mobile-nav-menu-toggle" onClick={() => setShowMobileMenu((v) => !v)} aria-label="Menu">
        <i className="fa fa-bars"></i>
      </button>

      {/* Mobile dropdown menu */}
      {showMobileMenu && (
        <div className="user-dropdown mobile-nav-menu-dropdown" ref={mobileMenuRef}>
          {/* Show user name if signed in */}
          {session && (
            <div className="dropdown-item dropdown-item-big">
              <i className="fa fa-user dropdown-item-icon fa-margin-right"></i>
              {session.user?.name || session.user?.email}
            </div>
          )}

          {/* Show settings and help buttons */}
          <SettingsButton setShowSettings={setShowSettings} setShowMobileMenu={setShowMobileMenu} />
          <HelpButton setShowHelp={setShowHelp} setShowMobileMenu={setShowMobileMenu} />

          {/* If not signed in, show sign in button */}
          {!session && (
            <SignInButton setShowSignIn={setShowSignIn} setShowMobileMenu={setShowMobileMenu} />
          )}

          {/* If signed in, show change password, sign out, and remove account buttons */}
          {session && (
            <>
              <ChangePasswordButton setShowChangePassword={setShowChangePassword} setShowMobileMenu={setShowMobileMenu} />
              <SignOutButton setShowMobileMenu={setShowMobileMenu} />
              <RemoveAccountButton setShowRemoveAccount={setShowRemoveAccount} setShowMobileMenu={setShowMobileMenu} />
            </>
          )}
        </div>
      )}
    </span>
  )
}

function SettingsButton({ 
  setShowSettings, 
  setShowMobileMenu 
}: { 
  setShowSettings: (show: boolean) => void, 
  setShowMobileMenu: (show: boolean) => void }
) {
  return (
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
  );
}

function HelpButton({ 
  setShowHelp, 
  setShowMobileMenu 
}: { 
  setShowHelp: (show: boolean) => void, 
  setShowMobileMenu: (show: boolean) => void }
) {
  return (
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
  );
}

function SignInButton({ 
  setShowSignIn, 
  setShowMobileMenu 
}: { 
  setShowSignIn: (show: boolean) => void, 
  setShowMobileMenu: (show: boolean) => void }
) {
  return (
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
  );
}

function ChangePasswordButton({ 
  setShowChangePassword, 
  setShowMobileMenu 
}: { 
  setShowChangePassword: (show: boolean) => void, 
  setShowMobileMenu: (show: boolean) => void }
) {
  return (
    <div
      className="dropdown-item dropdown-item-big"
      onClick={() => {
        setShowChangePassword(true);
        setShowMobileMenu(false);
      }}
    >
      <i className="fa fa-key dropdown-item-icon fa-margin-right"></i>
      Change Password
    </div>
  );
}

function SignOutButton({ setShowMobileMenu }: { setShowMobileMenu: (show: boolean) => void }) {
  return (
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
  );
}

function RemoveAccountButton({ 
  setShowRemoveAccount, 
  setShowMobileMenu 
}: { 
  setShowRemoveAccount: (show: boolean) => void, 
  setShowMobileMenu: (show: boolean) => void }
) {
  return (
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
  );
}
