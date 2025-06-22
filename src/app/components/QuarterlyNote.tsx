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
    isCreating,
    isResizing,
    removeNote,
    changeContent,
    changeEventColor,
    onMoveStart,
    onResizeStart,
  }: {
    i: number,
    j: number,
    w: number,
    h: number,
    content: string,
    color: string | null,
    isCreating: boolean,
    isResizing: boolean,
    removeNote: (i: number, j: number) => void,
    changeContent: (i: number, j: number, content: string) => void,
    changeEventColor: (i: number, j: number, color: string) => void,
    onMoveStart: (i: number, j: number, e: React.MouseEvent) => void,
    onResizeStart: (i: number, j: number, e: React.MouseEvent) => void,
  }
) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const displayColor = hoverColor ?? color ?? "default";

  const [menuOpen, setMenuOpen] = useState(false);

  const noteWidth = w * 20 - 5;
  const noteHeight = h * 21 - 5;

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
      className={`day-event ${displayColor}${isCreating ? " selecting" : ""}${isResizing ? " resizing" : ""}`}
      style={{width: `${noteWidth}px`, height: `${noteHeight}px`}}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        inputRef.current?.focus()
      }}
      onContextMenu={handleContextMenu}
    >
      <div
        className="note-move-handle"
        onMouseDown={e => {
          e.stopPropagation();
          onMoveStart(i, j, e);
        }}
      />

      {!isCreating && (
        <textarea
          ref={inputRef}
          style={{width: `${noteWidth - 2}px`, height: `${noteHeight - 2}px`}}
          placeholder="event"
          value={content}
          onChange={e => {
            changeContent(i, j, e.target.value);
          }}
          onKeyDown={e => {
            if ((e.key === "Backspace" || e.key === "Delete") && content === "") {
              e.preventDefault();
              removeNote(i, j);
            }
          }}
        />
      )}

      <div
        className="note-resize-handle"
        onMouseDown={e => {
          e.stopPropagation();
          onResizeStart(i, j, e);
        }}
      />
    </div>
  );
}
