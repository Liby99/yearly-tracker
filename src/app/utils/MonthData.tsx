import MonthlyTopicData, { localStorageMonthlyTopicData } from "./MonthlyTopicData";

type MonthData = {
  topicOrder: Array<number>,
  topics: Array<MonthlyTopicData>,
}

export default MonthData;

export const DEFAULT_TOPICS_IDS = [0, 1, 2, 3];

export function localStorageMonthData(year: number, month: number) : MonthData {
  return {
    topicOrder: localStorageMonthlyTopicOrder(year, month),
    topics: DEFAULT_TOPICS_IDS.map(topicId => localStorageMonthlyTopicData(year, month, topicId)),
  }
}

export function localStorageMonthlyTopicOrder(year: number, month: number) : Array<number> {
  const topicOrderStorageKey = `year-${year}/month-${month}/topic-order`;
  const saved = localStorage.getItem(topicOrderStorageKey);
  return saved ? JSON.parse(saved) : DEFAULT_TOPICS_IDS;
}

export function localStorageSaveMonthlyTopicOrder(year: number, month: number, topicOrder: Array<number>) {
  const topicOrderStorageKey = `year-${year}/month-${month}/topic-order`;
  localStorage.setItem(topicOrderStorageKey, JSON.stringify(topicOrder));
}
