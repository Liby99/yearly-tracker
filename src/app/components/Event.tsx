import React, { useState, useEffect, useRef } from "react"

export default function Event(
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
