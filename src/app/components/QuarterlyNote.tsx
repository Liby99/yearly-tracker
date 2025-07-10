import React, { useRef, useState } from "react"

import StickerMenu from "./popup/StickerMenu";

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

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (eventRef.current) {
      setMenuOpen(true);
    }
  };

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

      <StickerMenu
        menuOpen={menuOpen}
        parentWidth={noteWidth}
        color={color}
        otherButtons={null}
        setMenuOpen={setMenuOpen}
        onSelectColor={(c) => changeColor(i, j, c)}
        onHoverColor={(c) => setHoverColor(c)}
        onRemove={() => removeNote(i, j)}
      />
    </div>
  );
}
