import React, { useRef, useState, useEffect } from "react"

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
    // eslint-disable-next-line
  }, [year, quarter]);

  // Save to localStorage whenever ranges change
  useEffect(() => {
    localStorageSetQuarterlyNotes(year, quarter, notes);
    // eslint-disable-next-line
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

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
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

  const handleMouseUp = () => {
    if (!dragging || !creatingNote) return;
    if (creatingNote.w > 1 && creatingNote.h > 1) {
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

  const modifyNote = (i: number, j: number, update: (note: QuarterlyNoteData) => QuarterlyNoteData) => {
    setNotes(notes => notes.map(n => n.i == i && n.j == j ? update(n) : n));
  };

  const changeContent = (i: number, j: number, c: string) => {
    modifyNote(i, j, n => ({...n, content: c}))
  };

  return (
    <div
      className="quarterly-note-content"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
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
                  removeNote={() => {}}
                  changeContent={changeContent}
                  changeEventColor={() => {}}
                  onResizeStart={() => {}}
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
                    isResizing={false}
                    removeNote={handleRemoveNote}
                    changeContent={changeContent}
                    changeEventColor={() => {}}
                    onResizeStart={() => {}}
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
