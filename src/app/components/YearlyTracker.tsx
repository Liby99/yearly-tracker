import React, { useState, useRef, useEffect } from "react"

import Year from "./Year";
import { downloadCalendarData, localStorageSetCalendarData, localStorageClearCalendarData } from "../utils/CalendarData"
import Configuration, { getConfiguration, defaultConfiguration, setConfiguration } from "../utils/Configuration"

export default function YearlyTracker() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

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

  const [configuration, setConfiguration] = useState<Configuration>(defaultConfiguration());

  useEffect(() => {
    setConfiguration(getConfiguration());
  }, []);

  const setShowToday = (showToday: boolean) => {
    const newConfiguration = { ...configuration, showToday };
    setConfiguration(newConfiguration);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let json = { years: {} };

      // Load
      try {
        json = JSON.parse(event.target?.result as string);
      } catch (err) {
        alert(`Error parsing input file "${file}". Please check console for error information.`);
        console.error(err);
        return;
      }

      localStorageSetCalendarData(json);
      window.location.reload(); // Reload to reflect changes
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const handleErase = () => {
    if (confirm(`Do you want to erase all notes and events in the year of ${year}?`)) {
      localStorageClearCalendarData();
      window.location.reload(); // Reload to reflect changes
    }
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
        <span style={{ fontSize: "12px" }}>
          <button
            className="save-upload-button"
            onClick={() => setShowToday(!configuration.showToday)}
          >
            <i className="fa fa-calendar" style={{marginRight: 5}}></i>
            {configuration.showToday ? "Hide Today" : "Show Today"}
          </button>
          <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
          <button
            className="save-upload-button"
            onClick={() => {
              downloadCalendarData("yearly-tracker-calendar.json");
            }}
          >
            <i className="fa fa-save" style={{marginRight: 5}}></i>
            Save
          </button>
          <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
          <button
            className="save-upload-button"
            onClick={handleUploadClick}
          >
            <i className="fa fa-upload" style={{marginRight: 5}}></i>
            Upload
          </button>
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
          <button
            className="save-upload-button"
            onClick={handleErase}
          >
            <i className="fa fa-eraser" style={{marginRight: 5}}></i>
            Erase
          </button>
        </span>
      </nav>
      <Year year={year} showToday={configuration.showToday} />
      <footer>
        &copy; 2025 Liby99, all rights reserved.
      </footer>
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
