'use client'

import React, { useState, useEffect, useRef } from "react"

function isValidDate(year: number, month: number, day: number): boolean {
  // JS months are 0-based, so subtract 1 from month
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function dayOfWeekString(year: number, month: number, day: number) : string {
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay(); // 0 (Sun) - 6 (Sat)
  const dayOfWeekStr = dayNames[dayOfWeek];
  return dayOfWeekStr;
}

function Event(
  {
    start,
    end,
    name,
    duration,
    isSelecting,
    resize,
    removeEvent,
    changeEventName,
    onResizeStart,
  }: {
    start: number,
    end: number,
    name: string,
    duration: number,
    isSelecting: boolean,
    resize: {side: "left" | "right", resizingDay: number, otherDay: number} | null,
    removeEvent: (start: number) => void,
    changeEventName: (day: number, name: string) => void,
    onResizeStart: (side: "left" | "right", resizingDay: number, otherDay: number) => void,
  }
) {
  const inputRef = useRef<HTMLInputElement>(null);

  const isResizingLeft = resize && resize.side === "left" && resize.otherDay == end;
  const isResizingRight = resize && resize.side === "right" && resize.otherDay == start;
  const isResizing = isResizingLeft || isResizingRight;

  return (
    <div
      className={`day-event${isSelecting ? " selecting" : ""}${isResizing ? " resizing" : ""}`}
      style={{width: `${duration * 30 - 5}px`}}
      onClick={() => inputRef.current?.focus()}
      onContextMenu={(event) => {
        event.preventDefault();
        if (confirm("Are you sure you want to delete the event")) {
          removeEvent(start);
        }
      }}
    >
      <div
        className={`event-handle left${isResizingLeft ? " resizing" : ""}`}
        onMouseDown={e => {
          e.stopPropagation();
          onResizeStart("left", start, end);
        }}
      />
      <input
        ref={inputRef}
        placeholder="event"
        value={name}
        onChange={e => changeEventName(start, e.target.value)}
        onKeyDown={e => {
          if ((e.key === "Backspace" || e.key === "Delete") && name === "") {
            e.preventDefault();
            removeEvent(start);
          }
        }}
      />
      <div
        className={`event-handle right${isResizingRight ? " resizing" : ""}`}
        onMouseDown={e => {
          e.stopPropagation();
          onResizeStart("right", end, start);
        }}
      />
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
    resize,
    removeEvent,
    changeEventName,
    onResizeStart,
  }: {
    year: number,
    month: number,
    topicId: number,
    day: number,
    selectedRange: { start: number | null, end: number | null },
    ranges: Array<Range>,
    resize: {side: "left" | "right", resizingDay: number, otherDay: number} | null,
    removeEvent: (day: number) => void,
    changeEventName: (day: number, name: string) => void,
    onResizeStart: (side: "left" | "right", resizingDay: number, otherDay: number) => void,
  }
) {
  let activeEvent: React.ReactElement | null = null;

  // First check if we need to render an active range
  if (selectedRange.start !== null && selectedRange.end !== null) {
    const start = Math.min(selectedRange.start, selectedRange.end);
    const end = Math.max(selectedRange.start, selectedRange.end);
    if (start == day) {
      const length = end - start + 1;
      activeEvent = (
        <Event
          start={start}
          end={end}
          name={""}
          duration={length}
          isSelecting={true}
          resize={resize}
          removeEvent={removeEvent}
          changeEventName={changeEventName}
          onResizeStart={onResizeStart}
        />
      );
    }
  }

  // Then check if we can render an event based on existing ones
  if (activeEvent === null) {
    for (const range of ranges) {
      if (range.start == day) {
        activeEvent = (
          <Event
            start={range.start}
            end={range.end}
            name={range.name}
            duration={range.duration()}
            isSelecting={false}
            resize={resize}
            removeEvent={removeEvent}
            changeEventName={changeEventName}
            onResizeStart={onResizeStart}
          />
        );
        break;
      }
    }
  }

  const isToday =
    year === new Date().getFullYear() &&
    month === new Date().getMonth() + 1 &&
    day === new Date().getDate();
  const todayFrame = isToday ? (
    <div className="today">
      {topicId == 3 ? (<div className="today-mark">TODAY</div>) : null}
    </div>
  ) : null;

  let noHover = selectedRange.start !== null || resize !== null;
  for (const range of ranges) {
    if (range.contains(day)) {
      noHover = noHover || true;
    }
  }

  const invalid = !isValidDate(year, month, day);
  const dayOfWeek = dayOfWeekString(year, month, day);

  return (
    <div
      className={`day-holder${invalid ? " invalid" : ""}${noHover ? " no-hover" : ""}`}
    >
      <div className="day-hover">
        <div className="day-in-week">{dayOfWeek}</div>
      </div>
      {todayFrame}
      {activeEvent}
    </div>
  )
}

class Range {
  start: number;
  end: number;
  name: string;

  constructor(start: number, end: number, name: string) {
    this.start = Math.min(start, end);
    this.end = Math.max(start, end);
    this.name = name;
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
  }: {
    year: number,
    month: number,
    topicId: number,
  }
) {
  // Related to topic
  const [topic, setTopic] = useState("");

  // Load from localStorage when year changes
  useEffect(() => {
    const saved = localStorage.getItem(`year-${year}/month-${month}/topic-${topicId}/topic`);
    if (saved) {
      setTopic(saved);
    } else {
      setTopic("");
    }
  }, [year]);

  // Save to localStorage whenever topics change
  useEffect(() => {
    localStorage.setItem(`year-${year}/month-${month}/topic-${topicId}/topic`, topic);
  }, [topic, year]);

  // Related to event ranges
  const [dragging, setDragging] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ start: number | null, end: number | null}>({ start: null, end: null });
  const [ranges, setRanges] = useState<Array<Range>>([]);

  // Load from localStorage when year changes
  useEffect(() => {
    const saved = localStorage.getItem(`year-${year}/month-${month}/topic-${topicId}/events`);
    if (saved) {
      setRanges(JSON.parse(saved).map(({start, end, name}: {start: number, end: number, name: string}) => new Range(start, end, name)));
    } else {
      setRanges([]);
    }
  }, [year]);

  // Save to localStorage whenever ranges change
  useEffect(() => {
    const toStore = ranges.map(range => ({start: range.start, end: range.end, name: range.name}));
    localStorage.setItem(`year-${year}/month-${month}/topic-${topicId}/events`, JSON.stringify(toStore));
  }, [ranges, year]);

  const removeEvent = (day: number) => {
    setRanges(ranges.filter(range => range.start != day));
    setResizing(null);
    setDragging(false);
  }

  // Related to resizing
  const [resizing, setResizing] = useState<null | {side: "left"|"right", resizingDay: number, otherDay: number}>(null);

  const handleResizeStart = (side: "left" | "right", resizingDay: number, otherDay: number) => {
    setResizing({ side, resizingDay, otherDay });
  };

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
    for (const range of ranges) {
      if (range.contains(day)) {
        return;
      }
    }

    setDragging(true);
    setSelectedRange({ start: day, end: day });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      if (selectedRange.start === null) return;

      // Get the bounding rect of the container
      const rect = event.currentTarget.getBoundingClientRect();

      // Calculate the day index based on mouse X position
      const x = event.clientX - rect.left;
      let day = Math.floor(x / 30) + 1; // 30 is the width of .day-holder
      if (day < 1) day = 1;
      if (day > 31) day = 31;

      if (selectedRange.end !== day) {
        setSelectedRange({ start: selectedRange.start, end: day });
      }
    }

    if (resizing) {
      // Get mouse position relative to the container
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const dayHolder = event.currentTarget.querySelector('.day-holder') as HTMLElement;
      const dayWidth = dayHolder ? dayHolder.offsetWidth : 30;
      let day = Math.floor(x / dayWidth) + 1;
      if (day < 1) day = 1;
      if (day > 31) day = 31;

      setRanges(ranges =>
        ranges.map(range => {
          if (resizing.side === "left" && range.end === resizing.otherDay) {
            // Prevent crossing over the end
            const newStart = Math.min(day, range.end);
            return new Range(newStart, range.end, range.name);
          } else if (resizing.side === "right" && range.start === resizing.otherDay) {
            // right side
            const newEnd = Math.max(day, range.start);
            return new Range(range.start, newEnd, range.name);
          }
          return range;
        })
      );
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      if (selectedRange.start && selectedRange.end) {
        setRanges([...ranges, new Range(selectedRange.start, selectedRange.end, "")]);
      }
      setSelectedRange({ start: null, end: null });
    }

    setDragging(false);
    setResizing(null);
  };

  const changeEventName = (day: number, name: string) => {
    const newRanges = ranges.map(range => {
      if (range.start === day) {
        return new Range(range.start, range.end, name);
      } else {
        return range
      }
    });
    setRanges(newRanges);
  };

  return (
    <div className="flex month-topic-holder">
      <div className="month-topic-header flex">
        <div className="month-topic-input-holder">
          <input
            className="month-topic-input"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
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
            resize={resizing}
            removeEvent={removeEvent}
            changeEventName={changeEventName}
            onResizeStart={handleResizeStart}
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
      </nav>
      <Calendar year={year} />
      <footer>
        &copy; 2025 Ziyang Li, all rights reserved
      </footer>
    </main>
  );
}
