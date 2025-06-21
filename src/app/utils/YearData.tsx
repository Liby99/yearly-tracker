import MonthData, { localStorageMonthData, localStorageSetMonthData } from "./MonthData"

type YearData = {
  months: Array<MonthData>,
}

export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default YearData;

export function localStorageYearData(year: number) : YearData {
  return {
    months: MONTHS.map(month => localStorageMonthData(year, month)),
  }
}

export function localStorageSetYearData(year: number, data: YearData) {
  for (const month of MONTHS) {
    localStorageSetMonthData(year, month, data.months[month - 1]);
  }
}
