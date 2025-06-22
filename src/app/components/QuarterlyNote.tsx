import React, { useRef, useState, useEffect } from "react"

const COLORS = ["default", "blue", "purple", "green", "yellow", "red"];

export default function Event(
  {
    i,
    j,
    w,
    h,
    content,
    color,
    isSelecting,
    isResizing,
    removeNote,
    changeContent,
    changeEventColor,
    onResizeStart,
  }: {
    i: number,
    j: number,
    w: number,
    h: number,
    content: string,
    color: string | null,
    isSelecting: boolean,
    isResizing: boolean,
    removeNote: (i: number, j: number) => void,
    changeContent: (i: number, j: number, content: string) => void,
    changeEventColor: (i: number, j: number, color: string) => void,
    onResizeStart: (i: number, j: number) => void,
  }
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const displayColor = hoverColor ?? color ?? "default";

  const [menuOpen, setMenuOpen] = useState(false);

  const noteWidth = w * 20 - 5;
  const noteHeight = h * 20 - 5;

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (eventRef.current) {
      setMenuOpen(true);
    }
  };

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => setMenuOpen(false);
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const colorPickers = COLORS.map(c => {
    const active = color === c || (!color && c === "default");
    return (
      <span
        key={c}
        className={`event-menu-color-picker ${c}${active ? " active" : ""}`}
        onClick={() => changeEventColor(i, j, c)}
        onMouseEnter={() => setHoverColor(c)}
        onMouseLeave={() => setHoverColor(null)}
      />
    );
  });

  return (
    <div
      ref={eventRef}
      className={`day-event ${displayColor}${isSelecting ? " selecting" : ""}${isResizing ? " resizing" : ""}`}
      style={{width: `${noteWidth}px`, height: `${noteHeight}px`}}
      onClick={() => inputRef.current?.focus()}
      onContextMenu={handleContextMenu}
    >
      <input
        ref={inputRef}
        placeholder="event"
        value={content}
        onChange={e => changeContent(i, j, e.target.value)}
        onKeyDown={e => {
          if ((e.key === "Backspace" || e.key === "Delete") && content === "") {
            e.preventDefault();
            removeNote(i, j);
          }
        }}
      />
    </div>
  );
}
