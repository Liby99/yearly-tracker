import React, { useRef, useState, useEffect } from "react"

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
    const handleClick = (e: MouseEvent) => {
      setMenuOpen(false);
    };
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

  return (
    <div
      ref={eventRef}
      className={`day-event ${displayColor}${isSelecting ? " selecting" : ""}${isResizing ? " resizing" : ""}`}
      style={{width: `${eventWidth}px`}}
      onClick={() => inputRef.current?.focus()}
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
        </div>
      )}
    </div>
  )
}
