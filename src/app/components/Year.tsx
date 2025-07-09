import React from "react"

import Quarter from "./Quarter"
import { ExternalCalendar } from "../utils/Configuration"

interface YearProps { 
  year: number,
  showToday: boolean,
  externalCalendar: ExternalCalendar,
}

export default function Year({ 
  year,
  showToday,
  externalCalendar,
}: YearProps) {
  return (
    <div>
      <Quarter year={year} quarter={1} showToday={showToday} externalCalendar={externalCalendar} />
      <Quarter year={year} quarter={2} showToday={showToday} externalCalendar={externalCalendar} />
      <nav className="flex print-only new-page">
        <span className="page-title">YEARLY TRACKER</span>
        <span style={{ position: "relative", display: "inline-block" }}>{year}</span>
      </nav>
      <Quarter year={year} quarter={3} showToday={showToday} externalCalendar={externalCalendar} />
      <Quarter year={year} quarter={4} showToday={showToday} externalCalendar={externalCalendar} />
    </div>
  );
}
