import React from "react"

import Event from "./Event"
import EventData from "../utils/EventData"

export default function Day(
  {
    year,
    month,
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
    day: number,
    selectedRange: { start: number | null, end: number | null },
    ranges: Array<EventData>,
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
      <div className="today-mark">TODAY</div>
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
