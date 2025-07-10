import React, { useRef, useState, useEffect } from "react"

import EventData from "../utils/EventData";
import StickerMenu from "./popup/StickerMenu";
import { ExternalCalendar } from "../utils/Configuration";

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
    externalCalendar,
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
    externalCalendar: ExternalCalendar,
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
  const [dayWidth, setDayWidth] = useState(getDayWidth());

  // Update day width when window resizes
  useEffect(() => {
    const handleResize = () => {
      setDayWidth(getDayWidth());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const eventWidth = duration * dayWidth - 5;

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
    const maxWidth = eventWidth + gapDays * dayWidth;
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
    if (externalCalendar === "ics") {
      generateAndDownloadICS(name, topicName, year, month, start, end);
    } else if (externalCalendar === "ics-url") { 
      generateAndDownloadICSURL(name, topicName, year, month, start, end);
    } else if (externalCalendar === "google") {
      generateAndDownloadGoogleCalendar(name, topicName, year, month, start, end);
    } else if (externalCalendar === "outlook") {
      generateAndDownloadOutlookCalendar(name, topicName, year, month, start, end);
    } else if (externalCalendar === "apple") {
      generateAndDownloadAppleCalendar(name, topicName, year, month, start, end);
    }
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

// 1. Download ICS
function generateAndDownloadICS(title: string, description: string, year: number, month: number, start: number, end: number) {
  const { startDate, endDate } = getAllDayRange(year, month, start, end);
  const ics = generateICS(title, description, startDate, endDate);
  const sanitizedTitle = sanitizeFilename(title);
  downloadICS(ics, `${sanitizedTitle}.ics`);
}

// 2. ICS as Data URL
function generateAndDownloadICSURL(title: string, description: string, year: number, month: number, start: number, end: number) {
  const { startDate, endDate } = getAllDayRange(year, month, start, end);
  const ics = generateICS(title, description, startDate, endDate);
  const dataUrl = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  window.open(dataUrl, "_blank");
}

// 3. Google Calendar
function generateAndDownloadGoogleCalendar(title: string, description: string, year: number, month: number, start: number, end: number) {
  const { startDate, endDate } = getAllDayRange(year, month, start, end);
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", title);
  url.searchParams.set("details", description || "");
  url.searchParams.set("dates", `${startDate}/${endDate}`);
  url.searchParams.set("sf", "true");
  url.searchParams.set("output", "xml");
  window.open(url.toString(), "_blank");
}

// 4. Outlook Calendar
function generateAndDownloadOutlookCalendar(title: string, description: string, year: number, month: number, start: number, end: number) {
  const { startDate, endDate } = getAllDayRange(year, month, start, end);
  // Outlook expects dates in YYYY-MM-DD format
  const formattedStartDate = `${startDate.slice(0, 4)}-${startDate.slice(4, 6)}-${startDate.slice(6, 8)}`;
  const formattedEndDate = `${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}`;
  
  const url = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
  url.searchParams.set("subject", title);
  url.searchParams.set("body", description || "");
  url.searchParams.set("startdt", formattedStartDate);
  url.searchParams.set("enddt", formattedEndDate);
  url.searchParams.set("allday", "true");
  window.open(url.toString(), "_blank");
}

// 5. Apple Calendar (same as ICS)
function generateAndDownloadAppleCalendar(title: string, description: string, year: number, month: number, start: number, end: number) {
  generateAndDownloadICSURL(title, description, year, month, start, end);
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

function formatDateForURL(year: number, month: number, day: number): string {
  // Format: YYYYMMDD
  return `${year}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}`;
}

function getAllDayRange(year: number, month: number, start: number, end: number) {
  const startDate = formatDateForURL(year, month, start);
  const nextDay = getNextDay(year, month, end);
  const endDate = formatDateForURL(nextDay.year, nextDay.month, nextDay.day);
  return { startDate, endDate };
}

// Responsive function to get day width based on screen size
function getDayWidth(): number {
  if (typeof window === 'undefined') return 30; // Default for SSR
  
  if (window.innerWidth <= 1366) {
    return 28;
  }
  return 30;
}
