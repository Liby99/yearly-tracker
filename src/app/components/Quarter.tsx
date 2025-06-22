import React from "react"

import Month from "./Month"
import QuarterlyNotes from "./QuarterlyNotes";

export default function Quarter(
  {
    year,
    quarter
  }: {
    year: number,
    quarter: number
  }
) {
  return (
    <section className="flex quarter-holder">

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
        <Month year={year} month={(quarter - 1) * 3 + 1} />
        <Month year={year} month={(quarter - 1) * 3 + 2} />
        <Month year={year} month={(quarter - 1) * 3 + 3} />
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
