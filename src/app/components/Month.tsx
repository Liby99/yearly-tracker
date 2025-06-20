import React, { useState, useEffect, useRef } from "react"

import MonthTopic from "./MonthTopic"

function monthName(month: number) : string {
  switch (month) {
    case 1: return "jan";
    case 2: return "feb";
    case 3: return "mar";
    case 4: return "apr";
    case 5: return "may";
    case 6: return "jun";
    case 7: return "jul";
    case 8: return "aug";
    case 9: return "sep";
    case 10: return "oct";
    case 11: return "nov";
    case 12: return "dec";
    default: throw new DOMException(`Unknown month ${month}`);
  }
}

export default function Month({ year, month }: { year: number, month: number }) {
  return (
    <div className="month-bar flex">
      <div className="month-header period-header items-center justify-center">{monthName(month)}</div>
      <div className="month-topics">
        {Array.from({ length: 4 }, (_, i) => i).map((i) => (
          <MonthTopic key={`month-${month}-topic-${i}`} year={year} month={month} topicId={i} />
        ))}
      </div>
    </div>
  );
}
