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

export function localStorageQuarterlyNotesKey(year: number, quarter: number) : string {
  return `year-${year}/quarter-${quarter}/notes`;
}

export function localStorageQuarterlyNotes(year: number, quarter: number) : Array<QuarterlyNoteData> {
  const saved = localStorage.getItem(localStorageQuarterlyNotesKey(year, quarter));
  return saved ? JSON.parse(saved) : [];
}

export function localStorageSetQuarterlyNotes(year: number, quarter: number, notes: Array<QuarterlyNoteData>) {
  localStorage.setItem(localStorageQuarterlyNotesKey(year, quarter), JSON.stringify(notes));
}
