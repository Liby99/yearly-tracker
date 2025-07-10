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

// Layout components
import Nav from "./layouts/Nav";
import Footer from "./layouts/Footer";

// All the hooks
import { useSync } from "../hooks/useSync"
import { useApplyTheme } from "../hooks/useApplyTheme";

/**
 * The main yearly tracker
 */
export default function YearlyTracker() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [configuration, setConfigurationState] = useState<ConfigurationType>(defaultConfiguration());

  // Modals show/hide states
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSignIn, setShowSignIn] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showRemoveAccount, setShowRemoveAccount] = useState<boolean>(false);

  // Initialize sync and theme
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
      {/* Navbar */}
      <Nav
        year={year}
        setYear={setYear}
        setShowSettings={setShowSettings}
        setShowHelp={setShowHelp}
        setShowSignIn={setShowSignIn}
        setShowChangePassword={setShowChangePassword}
        setShowRemoveAccount={setShowRemoveAccount}
      />

      {/* Yearly tracker (main content) */}
      <Year 
        year={year}
        showToday={configuration.showToday}
        externalCalendar={configuration.externalCalendar}
      />

      {/* Footer */}
      <Footer 
        setShowHelp={setShowHelp}
        setShowSettings={setShowSettings}
      />

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
