import React, { useRef, useState, useEffect } from "react"

import ColorPicker from "./ColorPicker";

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
    isMoving,
    removeNote,
    changeContent,
    changeColor,
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
    isMoving: boolean,
    removeNote: (i: number, j: number) => void,
    changeContent: (i: number, j: number, content: string) => void,
    changeColor: (i: number, j: number, color: string | null) => void,
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

  const menuWidth = 180;
  const marginLeft = (noteWidth - menuWidth) / 2;

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

  const isOperating = isResizing || isMoving;

  return (
    <div
      ref={eventRef}
      className={`sticker ${displayColor}${isCreating ? " selecting" : ""}${isResizing ? " resizing" : ""}${h === 1 ? " h1" : ""}${isOperating ? " operating" : ""}`}
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
          onMouseDown={() => setMenuOpen(false)}
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

      {menuOpen && (
        <div
          className="sticker-menu-holder"
          style={{
            top: -36,
            marginTop: 0,
            marginLeft: `${marginLeft}px`,
            width: menuWidth,
          }}
        >
          <div className="flex sticker-menu" onMouseDown={e => e.stopPropagation()}>
            <ColorPicker
              color={color}
              onSelectColor={(c) => changeColor(i, j, c)}
              onHoverColor={(c) => setHoverColor(c)}
            />
            <span className="sticker-menu-div"></span>
            <span
              className="sticker-menu-delete-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeNote(i, j);
              }}
            >
              <i className="fa fa-trash"></i>
            </span>
          </div>
          <div className="sticker-menu-caret-holder">
            <i className="fa fa-caret-down"></i>
          </div>
        </div>
      )}
    </div>
  );
}
