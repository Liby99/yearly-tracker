import React from "react"

import Month from "./Month"
import QuarterlyNotes from "./QuarterlyNotes";
import { ExternalCalendar } from "../utils/Configuration";

/**
 * A quarter, which contains a quarterly notes and three months.
 * 
 * Offers the following features:
 * - Showing quarterly notes
 * - Showing months
 * 
 * @param year - The year of the quarter
 * @param quarter - The quarter of the year
 * @param showToday - Whether to show the today marker on the quarter
 */
export default function Quarter(
  {
    year,
    quarter,
    showToday,
    externalCalendar,
  }: {
    year: number,
    quarter: number,
    showToday: boolean,
    externalCalendar: ExternalCalendar,
  }
) {
  const isSpringSummer = quarter === 1 || quarter === 3;

  return (
    <section className={`flex quarter-holder${isSpringSummer ? " spring-summer" : " autumn-winter"}`}>

      <div className="quarterly-note-holder">
        <div className="period-header border-bottom">quarter {quarterHeader(quarter)}</div>
        <QuarterlyNotes year={year} quarter={quarter} />
      </div>

      <div className="quarterly-months-holder">
        <div className="flex">
          <div className="period-header border-bottom month-header-holder">month</div>
          <div className="flex border-bottom">
            {Array.from({ length: 31 }, (_, i) => (
              <span className="day-header-holder" key={i + 1}>{i + 1}</span>
            ))}
          </div>
        </div>
        <Month 
          year={year} 
          month={(quarter - 1) * 3 + 1} 
          showToday={showToday} 
          externalCalendar={externalCalendar} 
        />
        <Month 
          year={year} 
          month={(quarter - 1) * 3 + 2} 
          showToday={showToday} 
          externalCalendar={externalCalendar} 
        />
        <Month 
          year={year} 
          month={(quarter - 1) * 3 + 3} 
          showToday={showToday} 
          externalCalendar={externalCalendar} 
        />
      </div>

    </section>
  );
}

function quarterHeader(quarter: number) : string {
  switch (quarter) {
    case 1: return "1st";
    case 2: return "2nd";
    case 3: return "3rd";
    case 4: return "4th";
    default: throw new DOMException(`Unknown quarter ${quarter}`);
  }
}
