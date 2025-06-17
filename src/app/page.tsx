'use client'

import React, { useState } from "react"

import Image from "next/image";

class Topic {

}

function isValidDate(year: number, month: number, day: number): boolean {
  // JS months are 0-based, so subtract 1 from month
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function Event(
  {
    start,
    end,
    duration,
    isSelecting,
    removeEvent,
  }: {
    start: number,
    end: number,
    duration: number,
    isSelecting: boolean,
    removeEvent: (start: number) => void,
  }
) {
  return (
    <div
      className={`day-event${isSelecting ? " selecting" : ""}`}
      style={{width: `${duration * 30 - 5}px`}}
      onContextMenu={(event) => {
        event.preventDefault();
        if (confirm("Are you sure you want to delete the event")) {
          removeEvent(start);
        }
      }}
    >
      <input />
    </div>
  )
}

function Day(
  {
    year,
    month,
    topicId,
    day,
    selectedRange,
    ranges,
    removeEvent,
  }: {
    year: number,
    month: number,
    topicId: number,
    day: number,
    selectedRange: { start: number | null, end: number | null },
    ranges: Array<Range>,
    removeEvent: (day: number) => void,
  }
) {
  let activeRange: React.ReactElement | null = null;
  if (selectedRange.start == day && selectedRange.end) {
    let start = Math.min(selectedRange.start, selectedRange.end);
    let end = Math.min(selectedRange.start, selectedRange.end);
    let length = end - start + 1;
    activeRange = (
      <Event
        start={start}
        end={end}
        duration={length}
        isSelecting={true}
        removeEvent={removeEvent}
      />
    );
  } else {
    for (let range of ranges) {
      if (range.start == day) {
        activeRange = (
          <Event
            start={range.start}
            end={range.end}
            duration={range.duration()}
            isSelecting={false}
            removeEvent={removeEvent}
          />
        );
        break;
      }
    }
  }

  const invalid = !isValidDate(year, month, day);

  return (
    <div
      className={`day-holder${invalid ? " invalid" : ""}`}
    >
      <div className="day-hover"></div>
      {activeRange}
    </div>
  )
}

class Range {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = Math.min(start, end);
    this.end = Math.max(start, end);
  }

  contains(day: number) {
    return this.start <= day && day <= this.end;
  }

  duration() {
    return this.end - this.start + 1;
  }
}

function MonthTopic(
  {
    year,
    month,
    topicId,
    topic,
  }: {
    year: number,
    month: number,
    topicId: number,
    topic: Topic | undefined
  }
) {
  const [dragging, setDragging] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ start: number | null, end: number | null}>({ start: null, end: null });
  const [ranges, setRanges] = useState<Array<Range>>([]);

  const removeEvent = (day: number) => {
    setRanges(ranges.filter(range => range.start != day));
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // Calculate which day was clicked
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const dayHolder = event.currentTarget.querySelector('.day-holder') as HTMLElement;
    const dayWidth = dayHolder ? dayHolder.offsetWidth : 30;
    let day = Math.floor(x / dayWidth) + 1;
    if (day < 1) day = 1;
    if (day > 31) day = 31;

    // Prevent starting selection if clicking on an existing range
    for (let range of ranges) {
      if (range.contains(day)) {
        return;
      }
    }

    setDragging(true);
    setSelectedRange({ start: day, end: day });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || selectedRange.start === null) return;

    // Get the bounding rect of the container
    const rect = event.currentTarget.getBoundingClientRect();

    // Calculate the day index based on mouse X position
    let x = event.clientX - rect.left;
    let day = Math.floor(x / 30) + 1; // 30 is the width of .day-holder
    if (day < 1) day = 1;
    if (day > 31) day = 31;

    if (selectedRange.end !== day) {
      setSelectedRange({ start: selectedRange.start, end: day });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    if (selectedRange.start && selectedRange.end) {
      setRanges([...ranges, new Range(selectedRange.start, selectedRange.end)]);
    }
    setSelectedRange({ start: null, end: null });
  };

  return (
    <div className="flex month-topic-holder">
      <div className="month-topic-header flex">
        <div className="month-topic-input-holder">
          <input className="month-topic-input" />
        </div>
      </div>
      <div
        className="flex month-topic-dates"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {Array.from({ length: 31 }, (_, i) => i + 1).map(i => (
          <Day
            key={`month-${month}-topic-${topicId}-day-${i}`}
            year={year}
            month={month}
            topicId={topicId}
            day={i}
            selectedRange={selectedRange}
            ranges={ranges}
            removeEvent={removeEvent}
          />
        ))}
      </div>
    </div>
  );
}

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

function Month({ year, month }: { year: number, month: number }) {
  return (
    <div className="month-bar flex">
      <div className="month-header period-header items-center justify-center">{monthName(month)}</div>
      <div className="month-topics">
        {Array.from({ length: 4 }, (_, i) => i).map((i) => (
          <MonthTopic
            key={`month-${month}-topic-${i}`}
            year={year}
            month={month}
            topicId={i}
            topic={undefined}
          />
        ))}
      </div>
    </div>
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

function Quarter(
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

function Calendar({ year }: { year: number }) {
  return (
    <div>
      <Quarter year={year} quarter={1} />
      <Quarter year={year} quarter={2} />
      <Quarter year={year} quarter={3} />
      <Quarter year={year} quarter={4} />
    </div>
  );
}

export default function Home() {
  const year = 2025;

  return (
    <main>
      <nav className="flex">
        <span className="page-title">YEARLY TRACKER</span>
        <span>{year}</span>
      </nav>
      <Calendar year={year} />
      <footer>
        &copy; 2025 Ziyang Li, all rights reserved
      </footer>
    </main>
  );
}
