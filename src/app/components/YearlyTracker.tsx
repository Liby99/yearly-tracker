import React, { useState, useEffect } from "react"

import Year from "./Year";
import Configuration from "./Configuration";
import { localStorageSetCalendarData } from "../utils/CalendarData"
import type ConfigurationType from "../utils/Configuration"
import { getConfiguration, defaultConfiguration } from "../utils/Configuration"

/**
 * The main yearly tracker
 */
export default function YearlyTracker() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [showSettings, setShowSettings] = useState<boolean>(false);

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

  const setShowToday = (showToday: boolean) => {
    setConfigurationState({ ...configuration, showToday });
  };

  return (
    <main>
      <nav className="flex">
        <span className="page-title">GRIDCAL YEARLY TRACKER</span>
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
          <button className="save-upload-button" onClick={() => setShowToday(!configuration.showToday)}>
            <i className="fa fa-calendar" style={{marginRight: 5}}></i>
            {configuration.showToday ? "Hide Today" : "Show Today"}
          </button>
          <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
          <button className="save-upload-button" onClick={() => window.print()}>
            <i className="fa fa-print" style={{marginRight: 5}}></i>
            Print
          </button>
          <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
          <button className="save-upload-button" onClick={() => setShowSettings(true)}>
            <i className="fa fa-cog" style={{marginRight: 5}}></i>
            Settings
          </button>
        </span>
      </nav>
      <Year 
        year={year}
        showToday={configuration.showToday}
        externalCalendar={configuration.externalCalendar}
      />
      <footer className="screen-only">
        &copy; 2025 Liby99, all rights reserved.
      </footer>
      
      <Configuration
        year={year}
        showSettings={showSettings}
        configuration={configuration}
        setShowSettings={setShowSettings}
        setConfiguration={setConfigurationState}
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
