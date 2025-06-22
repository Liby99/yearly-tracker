import React, { useRef, useState, useEffect } from "react"

import EventData from "../utils/EventData";

const COLORS = ["default", "blue", "purple", "green", "yellow", "red"];

export default function Event(
  {
    start,
    end,
    name,
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
    start: number,
    end: number,
    name: string,
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

  const menuWidth = 180;
  const eventWidth = duration * 30 - 5;
  const marginLeft = (eventWidth - menuWidth) / 2;

  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const displayColor = hoverColor ?? color ?? "default";

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (eventRef.current) {
      setMenuOpen(true);
    }
  };

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = () => setMenuOpen(false);
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const colorPickers = COLORS.map(c => {
    const active = color === c || (!color && c === "default");
    return (
      <span
        key={c}
        className={`event-menu-color-picker ${c}${active ? " active" : ""}`}
        onClick={() => changeEventColor(start, c)}
        onMouseEnter={() => setHoverColor(c)}
        onMouseLeave={() => setHoverColor(null)}
      />
    );
  });

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
    inputWidth = mirrorRef.current.offsetWidth;
  }

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
      {menuOpen && (
        <div className="event-menu-holder" style={{ marginLeft: `${marginLeft}px`, width: menuWidth }}>
          <div className="flex event-menu" onMouseDown={e => e.stopPropagation()}>
            {colorPickers}
            <span className="event-menu-div"></span>
            <span
              className="event-menu-delete-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeEvent(start);
              }}
            >
              <i className="fa fa-trash"></i>
            </span>
          </div>
          <div className="event-menu-caret-holder">
            <i className="fa fa-caret-down"></i>
          </div>
        </div>
      )}
      <span ref={mirrorRef} className="mirror-ref">{name}</span>
    </div>
  )
}
