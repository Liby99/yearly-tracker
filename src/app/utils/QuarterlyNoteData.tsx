type QuarterlyNoteData = {
  i: number,
  j: number,
  w: number,
  h: number,
  content: string,
  color: string | null,
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

export function localStorageQuarterlyNotesKey(userId: string | undefined, year: number, quarter: number) : string {
  if (userId) {
    return `user-${userId}/year-${year}/quarter-${quarter}/notes`;
  } else {
    return `local/year-${year}/quarter-${quarter}/notes`;
  }
}

export function localStorageQuarterlyNotes(userId: string | undefined, year: number, quarter: number) : Array<QuarterlyNoteData> {
  const key = localStorageQuarterlyNotesKey(userId, year, quarter);
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
}

export function localStorageSetQuarterlyNotes(userId: string | undefined, year: number, quarter: number, notes: Array<QuarterlyNoteData>) {
  const key = localStorageQuarterlyNotesKey(userId, year, quarter);
  localStorage.setItem(key, JSON.stringify(notes));
}

export function localStorageClearQuarterlyNotes(userId: string | undefined, year: number, quarter: number) {
  localStorageSetQuarterlyNotes(userId, year, quarter, [])
}
