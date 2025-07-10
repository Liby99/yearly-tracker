"use client"

import React, { useState, useEffect } from "react"  

// All the util types
import type ConfigurationType from "../utils/Configuration"
import { getConfiguration, defaultConfiguration, setConfiguration } from "../utils/Configuration"

// All the components
import Year from "./Year";

// All the modals
import Configuration from "./modals/Configuration";
import Help from "./modals/Help";
import SignIn from "./modals/SignIn";
import ChangePassword from "./modals/ChangePassword";
import RemoveAccount from "./modals/RemoveAccount";
import UserAccountDropdown from "./buttons/UserAccountButton";

// All the hooks
import { useSync } from "../hooks/useSync"
import { useApplyTheme } from "../hooks/useApplyTheme";
import { useSession, signOut } from "next-auth/react"

/**
 * The main yearly tracker
 */
export default function YearlyTracker() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSignIn, setShowSignIn] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showRemoveAccount, setShowRemoveAccount] = useState<boolean>(false);
  const [configuration, setConfigurationState] = useState<ConfigurationType>(defaultConfiguration());
  const { data: session } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

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

  // Initialize sync for the current year - this will trigger database pull on page load
  useSync(year);

  useApplyTheme(configuration.theme);

  // Set year from URL or current year on client only
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(getYearFromUrl(currentYear));
  }, []);

  // Update URL when year changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("year", String(year));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [year]);

  useEffect(() => {
    setConfigurationState(getConfiguration());
  }, []);

  useEffect(() => {
    setConfiguration(configuration);
  }, [configuration]);

  return (
    <main>
      <nav className="flex">
        <span className="page-title">YEARLY TRACKER</span>
        <span style={{ position: "relative", display: "inline-block" }}>
          {year}
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          >
            {Array.from({ length: 7 }, (_, i) => 2024 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </span>
        <span style={{ display: "inline-block", flex: 1 }}></span>
        <span style={{ fontSize: "12px" }} className="screen-only no-show-mobile">
          <button className="save-upload-button" onClick={() => window.print()}>
            <i className="fa fa-print" style={{marginRight: 5}}></i>
            Print
          </button>
          <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
          <button className="save-upload-button" onClick={() => setShowSettings(true)}>
            <i className="fa fa-cog" style={{marginRight: 5}}></i>
            Settings
          </button>
          <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
          <button className="save-upload-button" onClick={() => setShowHelp(true)}>
            <i className="fa fa-question-circle" style={{marginRight: 5}}></i>
            Help
          </button>
          <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
          <UserAccountDropdown
            onChangePassword={() => setShowChangePassword(true)}
            onRemoveAccount={() => setShowRemoveAccount(true)}
            onSignIn={() => setShowSignIn(true)}
          />
        </span>
        {/* Mobile menu button and dropdown */}
        <span className="show-mobile-only" style={{ position: "relative" }}>
          <button
            className="save-upload-button"
            style={{ fontSize: 20, padding: 6 }}
            onClick={() => setShowMobileMenu(v => !v)}
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
                <i className="fa fa-cog dropdown-item-icon"></i>
                Settings
              </div>
              <div
                className="dropdown-item dropdown-item-big"
                onClick={() => {
                  setShowHelp(true);
                  setShowMobileMenu(false);
                }}
              >
                <i className="fa fa-question-circle dropdown-item-icon"></i>
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
                  <i className="fa fa-sign-in dropdown-item-icon"></i>
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
                    <i className="fa fa-key dropdown-item-icon"></i>
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
                    <i className="fa fa-sign-out dropdown-item-icon"></i>
                    Sign Out
                  </div>
                  <div
                    className="dropdown-item dropdown-item-big danger"
                    onClick={() => {
                      setShowRemoveAccount(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <i className="fa fa-trash dropdown-item-icon"></i>
                    Remove Account
                  </div>
                </>
              )}
            </div>
          )}
        </span>
      </nav>
      <Year 
        year={year}
        showToday={configuration.showToday}
        externalCalendar={configuration.externalCalendar}
      />
      <footer className="screen-only">
        &copy; 2025 <a href="https://liby99.github.io">Liby99</a>, all rights reserved.
        <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
        <a onClick={() => setShowHelp(true)}>Help</a>
        <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
        <a onClick={() => setShowSettings(true)}>Settings</a>
      </footer>
      
      {/* Modals */}
      <Configuration year={year} showSettings={showSettings} configuration={configuration} setShowSettings={setShowSettings} setConfiguration={setConfigurationState} />
      <Help showHelp={showHelp} setShowHelp={setShowHelp} />
      <SignIn isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
      <ChangePassword isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} />
      <RemoveAccount isOpen={showRemoveAccount} onClose={() => setShowRemoveAccount(false)} />
    </main>
  );
}

function getYearFromUrl(defaultYear: number) {
  if (typeof window === "undefined") return defaultYear;
  const params = new URLSearchParams(window.location.search);
  const yearParam = params.get("year");
  const yearNum = yearParam ? parseInt(yearParam, 10) : NaN;
  return !isNaN(yearNum) ? yearNum : defaultYear;
}
