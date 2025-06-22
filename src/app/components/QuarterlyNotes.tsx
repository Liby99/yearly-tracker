import React, { useState, useEffect } from "react"

import QuarterlyNote from "./QuarterlyNote";
import
  QuarterlyNoteData,
  {
    quarterlyNoteContainsCell,
    localStorageQuarterlyNotes,
    localStorageSetQuarterlyNotes,
  }
from "../utils/QuarterlyNoteData";

export default function QuarterlyNotes(
  {
    year,
    quarter,
  }: {
    year: number,
    quarter: number,
  }
) {
  const gridX = 10;
  const gridY = 20;

  // Related to event ranges
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ i: number, j: number } | null>(null);
  const [creatingNote, setCreatingNote] = useState<{ i: number, j: number, w: number, h: number} | null>(null);
  const [notes, setNotes] = useState<Array<QuarterlyNoteData>>([]);

  // Load from localStorage when year changes
  useEffect(() => {
    setNotes(localStorageQuarterlyNotes(year, quarter));
  }, [year, quarter]);

  // Save to localStorage whenever ranges change
  useEffect(() => {
    localStorageSetQuarterlyNotes(year, quarter, notes);
  }, [notes, year, quarter]);

  const cellCanHover: Array<Array<boolean>> =
    Array.from({length: gridY}, (_, i) =>
      Array.from({length: gridX}, (_, j) =>
        notes.find(n => quarterlyNoteContainsCell(n, i, j)) === undefined
      )
    );

  const getCellFromEvent = (event: React.MouseEvent<HTMLDivElement>) => {
    const cell = (event.target as HTMLElement).closest(".quarterly-note-content-cell");
    if (!cell) return null;
    const row = cell.parentElement;
    if (!row) return null;
    const i = Array.from(row.parentElement!.children).indexOf(row);
    const j = Array.from(row.children).indexOf(cell);
    return { i, j };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const cell = getCellFromEvent(event);
    if (!cell) return;
    setDragStart(cell);
    setCreatingNote({ i: cell.i, j: cell.j, w: 1, h: 1 });
    setDragging(true);
  };

  const handleCreatingMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !dragStart) return;
    const cell = getCellFromEvent(event);
    if (!cell) return;
    const w = Math.abs(cell.j - dragStart.j) + 1;
    const h = Math.abs(cell.i - dragStart.i) + 1;
    setCreatingNote({
      i: Math.min(dragStart.i, cell.i),
      j: Math.min(dragStart.j, cell.j),
      w,
      h,
    });
  };

  const handleCreatingMouseUp = () => {
    if (!dragging || !creatingNote) return;
    if (creatingNote.w >= 1 && creatingNote.h >= 1) {
      setNotes(prev => [
        ...prev,
        {
          ...creatingNote,
          content: "",
          color: "default",
        }
      ]);
    }
    setCreatingNote(null);
    setDragging(false);
    setDragStart(null);
  };

  const handleRemoveNote = (i: number, j: number) => {
    setNotes(notes => notes.filter(n => !(n.i == i && n.j == j)));
  };

  const [resizing, setResizing] = useState<{
    i: number,
    j: number,
    startX: number,
    startY: number,
    origW: number,
    origH: number
  } | null>(null);

  const handleOnResizeStart = (i: number, j: number, e: React.MouseEvent) => {
    const note = notes.find(n => n.i === i && n.j === j);
    if (!note) return;
    setResizing({
      i,
      j,
      startX: e.clientX,
      startY: e.clientY,
      origW: note.w,
      origH: note.h,
    });
  };

  const handleResizeMouseMove = (e: React.MouseEvent) => {
    if (!resizing) return;
    const dx = Math.max(1, resizing.origW + Math.round((e.clientX - resizing.startX) / 20));
    const dy = Math.max(1, resizing.origH + Math.round((e.clientY - resizing.startY) / 20));
    modifyNote(resizing.i, resizing.j, n => ({
      ...n,
      w: dx,
      h: dy,
    }));
  };

  const handleResizeMouseUp = () => {
    if (resizing) setResizing(null);
  };

  const [movingNote, setMovingNote] = useState<{
    i: number,
    j: number,
    startX: number,
    startY: number,
    origI: number,
    origJ: number,
  } | null>(null);

  const handleOnMoveNoteStart = (i: number, j: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMovingNote({
      i,
      j,
      startX: e.clientX,
      startY: e.clientY,
      origI: i,
      origJ: j,
    });
  };

  const handleMoveNoteMouseMove = (e: React.MouseEvent) => {
    if (!movingNote) return;

    // delta x, y
    const deltaX = e.clientX > movingNote.startX
      ? Math.floor((e.clientX - movingNote.startX) / 20)
      : Math.ceil((e.clientX - movingNote.startX) / 20);
    const deltaY = e.clientY > movingNote.startY
      ? Math.floor((e.clientY - movingNote.startY) / 20)
      : Math.ceil((e.clientY - movingNote.startY) / 20);

    // note i, j
    const note = notes.find(n => n.i === movingNote.origI && n.j === movingNote.origJ);
    if (!note) return;
    const maxI = gridY - note.h;
    const maxJ = gridX - note.w;
    const newI = Math.max(0, Math.min(maxI, movingNote.origI + deltaY));
    const newJ = Math.max(0, Math.min(maxJ, movingNote.origJ + deltaX));

    // check for overlap with other notes
    const isOccupied = notes.some(n => n !== note && n.i == newI && n.j == newJ);

    // isOccupied
    if ((newI !== movingNote.i || newJ !== movingNote.j) && !isOccupied) {
      setMovingNote({
        i: newI,
        j: newJ,
        origI: newI,
        origJ: newJ,
        startX: movingNote.startX + (e.clientX - movingNote.startX),
        startY: movingNote.startY + (e.clientY - movingNote.startY),
      });
      setNotes(notes => {
        return notes.map(n => {
          if (n.i === movingNote.i && n.j === movingNote.j) {
            return { ...n, i: newI, j: newJ };
          } else {
            return n;
          }
        });
      });
    }
  };

  const handleMoveNoteMouseUp = () => {
    if (movingNote) setMovingNote(null);
  };

  const modifyNote = (i: number, j: number, update: (note: QuarterlyNoteData) => QuarterlyNoteData) => {
    setNotes(notes => notes.map(n => n.i == i && n.j == j ? update(n) : n));
  };

  const changeContent = (i: number, j: number, c: string) => {
    modifyNote(i, j, n => ({...n, content: c}))
  };

  const changeColor = (i: number, j: number, color: string | null) => {
    modifyNote(i, j, n => ({...n, color}))
  };

  return (
    <div
      className="quarterly-note-content"
      onMouseDown={handleMouseDown}
      onMouseUp={() => {
        handleCreatingMouseUp();
        handleResizeMouseUp();
        handleMoveNoteMouseUp();
      }}
      onMouseMove={(e) => {
        handleCreatingMouseMove(e);
        handleResizeMouseMove(e);
        handleMoveNoteMouseMove(e);
      }}
    >
      {Array.from({length: gridY}, (_, i) => (
        <div key={i} className="quarterly-note-content-row flex">
          {Array.from({length: gridX}, (_, j) => {
            let noteElem = null;
            if (creatingNote && creatingNote.i === i && creatingNote.j === j) {
              noteElem = (
                <QuarterlyNote
                  i={i}
                  j={j}
                  w={creatingNote.w}
                  h={creatingNote.h}
                  content=""
                  color="default"
                  isCreating={true}
                  isResizing={false}
                  isMoving={false}
                  removeNote={() => {}}
                  changeContent={changeContent}
                  changeColor={changeColor}
                  onResizeStart={handleOnResizeStart}
                  onMoveStart={handleOnMoveNoteStart}
                />
              );
            } else {
              const note = notes.find(n => n.i === i && n.j === j);
              if (note) {
                noteElem = (
                  <QuarterlyNote
                    i={i}
                    j={j}
                    w={note.w}
                    h={note.h}
                    content={note.content}
                    color={note.color}
                    isCreating={false}
                    isResizing={(resizing && resizing.i == i && resizing.j == j) || false}
                    isMoving={(movingNote && movingNote.i == i && movingNote.j == j) || false}
                    removeNote={handleRemoveNote}
                    changeContent={changeContent}
                    changeColor={changeColor}
                    onResizeStart={handleOnResizeStart}
                    onMoveStart={handleOnMoveNoteStart}
                  />
                );
              }
            }

            return (
              <div
                key={j}
                className={`quarterly-note-content-cell${cellCanHover[i][j] ? "" : " no-hover"}`}
              >
                {noteElem}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
