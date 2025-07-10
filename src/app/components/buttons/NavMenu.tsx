import React from "react";
import DesktopNavMenu from "./DesktopNavMenu";
import MobileNavMenu from "./MobileNavMenu";

export interface NavMenuProps {
  setShowSettings: (v: boolean) => void;
  setShowHelp: (v: boolean) => void;
  setShowSignIn: (v: boolean) => void;
  setShowChangePassword: (v: boolean) => void;
  setShowRemoveAccount: (v: boolean) => void;
}

export default function NavMenu({
  setShowSettings,
  setShowHelp,
  setShowSignIn,
  setShowChangePassword,
  setShowRemoveAccount,
}: NavMenuProps) {
  return (
    <>
      {/* Desktop nav menu */}
      <DesktopNavMenu
        setShowSettings={setShowSettings}
        setShowHelp={setShowHelp}
        setShowSignIn={setShowSignIn}
        setShowChangePassword={setShowChangePassword}
        setShowRemoveAccount={setShowRemoveAccount}
      />

      {/* Mobile nav menu */}
      <MobileNavMenu
        setShowSettings={setShowSettings}
        setShowHelp={setShowHelp}
        setShowSignIn={setShowSignIn}
        setShowChangePassword={setShowChangePassword}
        setShowRemoveAccount={setShowRemoveAccount}
      />
    </>
  );
}
