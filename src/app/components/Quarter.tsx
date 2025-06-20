import React from "react"

import Month from "./Month"

function quarterHeader(quarter: number) : string {
  switch (quarter) {
    case 1: return "1st";
    case 2: return "2nd";
    case 3: return "3rd";
    case 4: return "4th";
    default: throw new DOMException(`Unknown quarter ${quarter}`);
  }
}

export default function Quarter(
  {
    year,
    quarter
  }: {
    year: number,
    quarter: number
  }
) {
  const gridX = 10;
  const gridY = 20;
  return (
    <section className="flex quarter-holder">
      {/* Quarterly note */}
      <div className="quarterly-note-holder">
        <div className="period-header border-bottom">quarter {quarterHeader(quarter)}</div>
        <div className="quarterly-note-content">
          {Array.from({length: gridY}, (_, i) => (
            <div key={i} className="quarterly-note-content-row flex">
              {Array.from({length: gridX}, (_, j) => (
                <div key={j} className="quarterly-note-content-cell">
                  <div></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Months */}
      <div>
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
