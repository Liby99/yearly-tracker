import YearData, { localStorageYearData, localStorageSetYearData, localStorageClearYearData } from "./YearData";

export const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

type CalendarData = {
  years: {
    [year: number]: YearData
  },
}

export default CalendarData;

export function localStorageCalendarData(userId: string | undefined) : CalendarData {
  const years: { [year: number]: YearData } = {};
  for (const year of YEARS) {
    years[year] = localStorageYearData(userId, year);
  }
  return { years };
}

export function downloadCalendarData(userId: string | undefined, filename: string) {
  const data = localStorageCalendarData(userId);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function localStorageSetCalendarData(userId: string | undefined, calendar: CalendarData) {
  for (const yearString in calendar.years) {
    const year = parseInt(yearString);
    localStorageSetYearData(userId, year, calendar.years[yearString]);
  }
}

export function localStorageClearCalendarData(userId: string | undefined) {
  for (const year of YEARS) {
    localStorageClearYearData(userId, year);
  }
}
