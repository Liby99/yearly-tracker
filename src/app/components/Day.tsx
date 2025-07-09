import React from "react"

import Event from "./Event"
import EventData, { eventDataContains, eventDataDuration } from "../utils/EventData"

/**
 * A day, which contains a single event.
 * 
 * Offers the following features:
 * - Showing today marker
 * - Showing event
 * - Showing selected event
 * - Showing invalid date
 * 
 * @param year - The year of the day
 * @param month - The month of the day
 * @param day - The day of the month
 * @param topicName - The name of the topic of the day
 * @param selectedRange - The range of the selected event
 * @param events - The events on the day
 * @param resize - The resize state of the event
 * @param removeEvent - The function to remove the event
 * @param changeEventName - The function to change the name of the event
 * @param changeEventColor - The function to change the color of the event
 * @param onResizeStart - The function to start resizing the event
 * @param showToday - Whether to show the today marker on the day
 */
export default function Day(
  {
    year,
    month,
    day,
    topicName,
    selectedRange,
    events,
    resize,
    removeEvent,
    changeEventName,
    changeEventColor,
    onResizeStart,
    showToday,
  }: {
    year: number,
    month: number,
    day: number,
    topicName: string,
    selectedRange: { start: number | null, end: number | null },
    events: Array<EventData>,
    resize: {side: "left" | "right", resizingDay: number, otherDay: number} | null,
    removeEvent: (day: number) => void,
    changeEventName: (day: number, name: string) => void,
    changeEventColor: (day: number, color: string) => void,
    onResizeStart: (side: "left" | "right", resizingDay: number, otherDay: number) => void,
    showToday: boolean,
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
          topicName={topicName}
          color={null}
          duration={length}
          isSelecting={true}
          resize={resize}
          events={events}
          removeEvent={removeEvent}
          changeEventName={changeEventName}
          changeEventColor={changeEventColor}
          onResizeStart={onResizeStart}
          year={year}
          month={month}
        />
      );
    }
  }

  // Then check if we can render an event based on existing ones
  if (activeEvent === null) {
    for (const event of events) {
      if (event.start == day) {
        activeEvent = (
          <Event
            start={event.start}
            end={event.end}
            name={event.name}
            topicName={topicName}
            color={event.color}
            duration={eventDataDuration(event)}
            isSelecting={false}
            resize={resize}
            events={events}
            removeEvent={removeEvent}
            changeEventName={changeEventName}
            changeEventColor={changeEventColor}
            onResizeStart={onResizeStart}
            year={year}
            month={month}
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
  const todayFrame = (isToday && showToday) ? (
    <div className="today screen-only">
      <div className="today-mark">TODAY</div>
    </div>
  ) : null;

  let noHover = selectedRange.start !== null || resize !== null;
  noHover = noHover || events.some(e => eventDataContains(e, day));

  const invalid = !isValidDate(year, month, day);
  const dayOfWeek = dayOfWeekString(year, month, day);

  let pop = !noHover && !invalid;
  if (activeEvent !== null) {
    pop = true;
  }

  return (
    <div
      className={`day-holder${invalid ? " invalid" : ""}${noHover ? " no-hover" : ""}${pop ? " pop" : ""}`}
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
