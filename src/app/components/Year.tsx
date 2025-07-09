import React from "react"

import Quarter from "./Quarter"

export default function Year({ 
  year,
  showToday,
}: { 
  year: number,
  showToday: boolean,
}) {
  return (
    <div>
      <Quarter year={year} quarter={1} showToday={showToday} />
      <Quarter year={year} quarter={2} showToday={showToday} />
      <nav className="flex print-only new-page">
        <span className="page-title">GRIDCAL YEARLY TRACKER</span>
        <span style={{ position: "relative", display: "inline-block" }}>{year}</span>
      </nav>
      <Quarter year={year} quarter={3} showToday={showToday} />
      <Quarter year={year} quarter={4} showToday={showToday} />
    </div>
  );
}
