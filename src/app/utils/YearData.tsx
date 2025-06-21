import MonthData, { localStorageMonthData } from "./MonthData"

type YearData = {
  months: Array<MonthData>,
}

export default YearData;

export function localStorageYearData(year: number) : YearData {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return {
    months: months.map(month => localStorageMonthData(year, month)),
  }
}
