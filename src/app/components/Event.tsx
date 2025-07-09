import React, { useRef, useState } from "react"

import EventData from "../utils/EventData";
import StickerMenu from "./StickerMenu";

/**
 * A single event on a day.
 * 
 * Offers the following features:
 * - Resizing
 * - Selecting
 * - Adding to calendar
 * - Changing name
 * - Changing color
 * - Removing
 * 
 * @param year - The year of the event
 * @param month - The month of the event
 * @param start - The start day of the event
 * @param end - The end day of the event
 * @param name - The name of the event
 * @param topicName - The name of the topic of the event
 * @param color - The color of the event
 * @param duration - The duration of the event in days
 * @param isSelecting - Whether the event is being selected
 * @param resize - The resize state of the event
 * @param events - The events on the day
 * @param removeEvent - The function to remove the event
 * @param changeEventName - The function to change the name of the event
 * @param changeEventColor - The function to change the color of the event
 * @param onResizeStart - The function to start resizing the event
 */
export default function Event(
  {
    year,
    month,
    start,
    end,
    name,
    topicName,
    color,
    duration,
    isSelecting,
    resize,
    events,
    removeEvent,
    changeEventName,
    changeEventColor,
    onResizeStart,
  }: {
    year: number,
    month: number,
    start: number,
    end: number,
    name: string,
    topicName: string,
    color: string | null,
    duration: number,
    isSelecting: boolean,
    resize: {side: "left" | "right", resizingDay: number, otherDay: number} | null,
    events: Array<EventData>,
    removeEvent: (start: number) => void,
    changeEventName: (day: number, name: string) => void,
    changeEventColor: (day: number, color: string) => void,
    onResizeStart: (side: "left" | "right", resizingDay: number, otherDay: number) => void,
  }
) {
  const inputRef = useRef<HTMLInputElement>(null);

  const isResizingLeft = resize && resize.side === "left" && resize.otherDay == end;
  const isResizingRight = resize && resize.side === "right" && resize.otherDay == start;
  const isResizing = isResizingLeft || isResizingRight;

  const eventRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const eventWidth = duration * 30 - 5;

  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const displayColor = hoverColor ?? color ?? "default";

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (eventRef.current) {
      setMenuOpen(true);
    }
  };

  // A mirror reference element that is used to estimate how long is the input
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [isHoveringInput, setIsHoveringInput] = useState(false);

  // Check if there is an immediate next event; if so, set a maximum width so that there is no overlap
  let inputWidth = eventWidth + 100;
  const nextEvent = events.filter(e => e.start > end).sort((a, b) => a.start - b.start)[0];
  if (nextEvent) {
    const gapDays = nextEvent.start - end - 1;
    const maxWidth = eventWidth + gapDays * 30;
    inputWidth = maxWidth;
  } else if (mirrorRef.current) {
    // If no immediate next event, can set the width to be whatever it needs to be (mirror-ref)
    inputWidth = mirrorRef.current.offsetWidth;
  }

  // If we have hovered on the input, we immediately overwrite the input width to be the mirror-ref's width
  if (isHoveringInput && mirrorRef.current) {
    inputWidth = Math.max(mirrorRef.current.offsetWidth, eventWidth);
  }

  const onAddToCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    generateAndDownloadICS(name, topicName, year, month, start, end);
  };

  const otherButtons = (
    <>
      <span className="sticker-menu-button" onClick={onAddToCalendarClick}>
        <i className="fa fa-calendar" style={{fontSize: "13px"}}></i>
        <i className="fa fa-plus" style={{fontSize: "10px", marginLeft: "-2px", position: "absolute", top: "4px"}}></i>
      </span>
    </>
  );

  return (
    <div
      ref={eventRef}
      className={`sticker ${displayColor}${isSelecting ? " selecting" : ""}${isResizing ? " resizing" : ""}`}
      style={{width: `${eventWidth}px`}}
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current?.focus();
      }}
      onMouseEnter={() => setIsHoveringInput(true)}
      onMouseLeave={() => setIsHoveringInput(false)}
      onContextMenu={handleContextMenu}
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
        style={{width: `${inputWidth}px`}}
        onChange={e => changeEventName(start, e.target.value)}
        onMouseDown={e => {
          e.stopPropagation();
          setMenuOpen(false);
        }}
        onKeyDown={e => {
          if ((e.key === "Backspace" || e.key === "Delete") && name === "") {
            e.preventDefault();
            removeEvent(start);
          }
        }}
      />
      <div
        className="event-input-bg"
        style={{
          left: `${eventWidth}px`,
          width: `${Math.max(0, (mirrorRef.current?.offsetWidth || 0) - eventWidth + 10)}px`
        }}
      />
      <div
        className={`event-handle right${isResizingRight ? " resizing" : ""}`}
        onMouseDown={e => {
          e.stopPropagation();
          onResizeStart("right", end, start);
        }}
      />
      <StickerMenu
        menuOpen={menuOpen}
        parentWidth={eventWidth}
        color={color}
        setMenuOpen={setMenuOpen}
        otherButtons={otherButtons}
        onSelectColor={(c) => changeEventColor(start, c)}
        onHoverColor={(c) => setHoverColor(c)}
        onRemove={() => removeEvent(start)}
      />
      <span ref={mirrorRef} className="mirror-ref">{name}</span>
    </div>
  )
}

function formatDate(year: number, month: number, day: number) : string {
  // Format: YYYYMMDD for all-day events
  return `${year}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}`;
}

function generateICS(title: string, topicName: string, start: string, end: string) : string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${topicName}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

function downloadICS(ics: string, filename: string) {
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateAndDownloadICS(title: string, topicName: string, year: number, month: number, start: number, end: number) {
  const startDate = formatDate(year, month, start);
  // For all-day events, the end date should be the day after the last day
  const nextDay = getNextDay(year, month, end);
  const endDate = formatDate(nextDay.year, nextDay.month, nextDay.day);
  const ics = generateICS(title, topicName, startDate, endDate);
  const sanitizedTitle = sanitizeFilename(title);
  downloadICS(ics, `${sanitizedTitle}.ics`);
}

function sanitizeFilename(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-|-$/g, '') // Remove leading and trailing hyphens
    || 'event'; // Fallback if title becomes empty
}

function getNextDay(year: number, month: number, day: number): { year: number, month: number, day: number } {
  // Create a Date object for the current day
  const currentDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
  
  // Add one day
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);
  
  return {
    year: nextDate.getFullYear(),
    month: nextDate.getMonth() + 1, // Convert back to 1-indexed month
    day: nextDate.getDate()
  };
}
