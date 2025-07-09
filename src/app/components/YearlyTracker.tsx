import React, { useState, useEffect } from "react"

import Year from "./Year";
import Configuration from "./Configuration";
import Help from "./Help";
import type ConfigurationType from "../utils/Configuration"
import { getConfiguration, defaultConfiguration, setConfiguration } from "../utils/Configuration"

/**
 * The main yearly tracker
 */
export default function YearlyTracker() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

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

  const [configuration, setConfigurationState] = useState<ConfigurationType>(defaultConfiguration());

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
        <span style={{ fontSize: "12px" }} className="screen-only">
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
      
      <Configuration
        year={year}
        showSettings={showSettings}
        configuration={configuration}
        setShowSettings={setShowSettings}
        setConfiguration={setConfigurationState}
      />

      <Help
        showHelp={showHelp}
        setShowHelp={setShowHelp}
      />
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
