import YearData, { localStorageYearData, localStorageSetYearData } from "./YearData";

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

export function downloadCalendarData(filename: string) {
  const data = localStorageCalendarData();
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

export function localStorageSetCalendarData(calendar: CalendarData) {
  for (const yearString in calendar.years) {
    const year = parseInt(yearString);
    localStorageSetYearData(year, calendar.years[yearString])
  }
}
