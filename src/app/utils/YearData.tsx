import MonthData, { localStorageMonthData, localStorageSetMonthData, localStorageClearMonthData } from "./MonthData"
import QuarterlyNoteData, { localStorageQuarterlyNotes, localStorageSetQuarterlyNotes, localStorageClearQuarterlyNotes } from "./QuarterlyNoteData";

type YearData = {
  notes: {[quarter: number]: Array<QuarterlyNoteData>},
  months: Array<MonthData>,
}

export default YearData;

export const QUARTERS = [1, 2, 3, 4];

export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function localStorageYearData(userId: string | null, year: number) : YearData {
  return {
    notes: Object.fromEntries(QUARTERS.map(q => [q, localStorageQuarterlyNotes(userId, year, q)])),
    months: MONTHS.map(month => localStorageMonthData(userId, year, month)),
  }
}

export function localStorageSetYearData(userId: string | null, year: number, data: YearData) {
  // Quarterly notes
  for (const quarterString in data.notes) {
    const quarter = parseInt(quarterString);
    localStorageSetQuarterlyNotes(userId, year, quarter, data.notes[quarterString]);
  }

  // Months
  for (const month of MONTHS) {
    localStorageSetMonthData(userId, year, month, data.months[month - 1]);
  }
}

export function localStorageClearYearData(userId: string | null, year: number) {
  for (const quarter of QUARTERS) {
    localStorageClearQuarterlyNotes(userId, year, quarter);
  }

  for (const month of MONTHS) {
    localStorageClearMonthData(userId, year, month);
  }
}
