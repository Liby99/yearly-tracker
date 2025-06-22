type QuarterlyNoteData = {
  i: number,
  j: number,
  w: number,
  h: number,
  content: string,
  color: string | null,
}

export default QuarterlyNoteData;

export function localStorageQuarterlyNotesKey(year: number, quarter: number) : string {
  return `year-${year}/quarter-${quarter}/notes`;
}

export function localStorageQuarterlyNotes(year: number, quarter: number) : Array<QuarterlyNoteData> {
  const saved = localStorage.getItem(localStorageQuarterlyNotesKey(year, quarter));
  return saved ? JSON.parse(saved) : [];
}
