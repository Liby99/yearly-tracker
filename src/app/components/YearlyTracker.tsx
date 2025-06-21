import React, { useState } from "react"

import Calendar from "./Calendar";

export default function YearlyTracker() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

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
        <span style={{ fontSize: "12px" }}>
          <button className="save-upload-button" onClick={() => downloadYearlyTrackerData(year)}>Save</button>
          <span style={{ display: "inline-block", margin: "0 5px" }}></span>
          <button className="save-upload-button" onClick={() => uploadYearlyTrackerData(year)}>Upload</button>
        </span>
      </nav>
      <Calendar year={year} />
      <footer>
        &copy; 2025 Ziyang Li, all rights reserved
      </footer>
    </main>
  );
}

function downloadYearlyTrackerData(year: number) {

}

function uploadYearlyTrackerData(year: number) {

}
