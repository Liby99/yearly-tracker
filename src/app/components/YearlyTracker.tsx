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
import NavMenu from "./buttons/NavMenu";

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
        <NavMenu
          setShowSettings={setShowSettings}
          setShowHelp={setShowHelp}
          setShowSignIn={setShowSignIn}
          setShowChangePassword={setShowChangePassword}
          setShowRemoveAccount={setShowRemoveAccount}
        />
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
