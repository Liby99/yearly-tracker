import React from "react"

import Quarter from "./Quarter"
import { ExternalCalendar } from "../utils/Configuration"

export default function Year({ 
  year,
  showToday,
  externalCalendar,
}: { 
  year: number,
  showToday: boolean,
  externalCalendar: ExternalCalendar,
}) {
  return (
    <div>
      <Quarter year={year} quarter={1} showToday={showToday} externalCalendar={externalCalendar} />
      <Quarter year={year} quarter={2} showToday={showToday} externalCalendar={externalCalendar} />
      <nav className="flex print-only new-page">
        <span className="page-title">GRIDCAL YEARLY TRACKER</span>
        <span style={{ position: "relative", display: "inline-block" }}>{year}</span>
      </nav>
      <Quarter year={year} quarter={3} showToday={showToday} externalCalendar={externalCalendar} />
      <Quarter year={year} quarter={4} showToday={showToday} externalCalendar={externalCalendar} />
    </div>
  );
}
