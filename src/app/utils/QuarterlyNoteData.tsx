type QuarterlyNoteData = {
  i: number,
  j: number,
  w: number,
  h: number,
  content: string,
  color: string | null,
}

type CalendarDataRecord = {
  [key: string]: {
    notes?: Array<QuarterlyNoteData>;
    [key: string]: unknown;
  };
}

export default QuarterlyNoteData;

export function quarterlyNoteContainsCell(note: QuarterlyNoteData, i: number, j: number) : boolean {
  return (
    note.i <= i &&
    i < note.i + note.h &&
    note.j <= j &&
    j < note.j + note.w
  );
}

export function localStorageQuarterlyNotesKey(userId: string | null, year: number, quarter: number) : string {
  if (userId) {
    return `user-${userId}/year-${year}/quarter-${quarter}/notes`;
  } else {
    return `year-${year}/quarter-${quarter}/notes`;
  }
}

export function localStorageQuarterlyNotes(userId: string | null, year: number, quarter: number) : Array<QuarterlyNoteData> {
  const saved = localStorage.getItem(localStorageQuarterlyNotesKey(userId, year, quarter));
  return saved ? JSON.parse(saved) : [];
}

export function localStorageSetQuarterlyNotes(userId: string | null, year: number, quarter: number, notes: Array<QuarterlyNoteData>) {
  localStorage.setItem(localStorageQuarterlyNotesKey(userId, year, quarter), JSON.stringify(notes));
}

export function localStorageClearQuarterlyNotes(userId: string | null, year: number, quarter: number) {
  localStorageSetQuarterlyNotes(userId, year, quarter, [])
}
