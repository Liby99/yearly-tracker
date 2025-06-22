import MonthData, { localStorageMonthData, localStorageSetMonthData } from "./MonthData"
import QuarterlyNoteData, { localStorageQuarterlyNotes, localStorageSetQuarterlyNotes } from "./QuarterlyNoteData";

type YearData = {
  notes: {[quarter: number]: Array<QuarterlyNoteData>},
  months: Array<MonthData>,
}

export default YearData;

export const QUARTERS = [1, 2, 3, 4];

export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function localStorageYearData(year: number) : YearData {
  return {
    notes: Object.fromEntries(QUARTERS.map(q => [q, localStorageQuarterlyNotes(year, q)])),
    months: MONTHS.map(month => localStorageMonthData(year, month)),
  }
}

export function localStorageSetYearData(year: number, data: YearData) {
  // Quarterly notes
  for (const quarterString in data.notes) {
    const quarter = parseInt(quarterString);
    localStorageSetQuarterlyNotes(year, quarter, data.notes[quarterString]);
  }

  // Months
  for (const month of MONTHS) {
    localStorageSetMonthData(year, month, data.months[month - 1]);
  }
}
