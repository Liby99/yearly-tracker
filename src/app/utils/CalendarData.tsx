import YearData, { localStorageYearData } from "./YearData";

export const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

type CalendarData = {
  years: {
    [year: number]: YearData
  },
}

export default CalendarData;

export function localStorageCalendarData() : CalendarData {
  const years: { [year: number]: YearData } = {};
  for (const year of YEARS) {
    years[year] = localStorageYearData(year);
  }
  return { years };
}
