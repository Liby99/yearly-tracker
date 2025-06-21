import MonthlyTopicData, { localStorageMonthlyTopicData, localStorageSetMonthlyTopicData } from "./MonthlyTopicData";

type MonthData = {
  order: Array<number>,
  topics: Array<MonthlyTopicData>,
}

export default MonthData;

export const DEFAULT_TOPICS_IDS = [0, 1, 2, 3];

export function localStorageMonthData(year: number, month: number) : MonthData {
  return {
    order: localStorageMonthlyTopicOrder(year, month),
    topics: DEFAULT_TOPICS_IDS.map(topicId => localStorageMonthlyTopicData(year, month, topicId)),
  }
}

export function localStorageMonthlyTopicOrder(year: number, month: number) : Array<number> {
  const topicOrderStorageKey = `year-${year}/month-${month}/topic-order`;
  const saved = localStorage.getItem(topicOrderStorageKey);
  return saved ? JSON.parse(saved) : DEFAULT_TOPICS_IDS;
}

export function localStorageSetMonthlyTopicOrder(year: number, month: number, topicOrder: Array<number>) {
  const topicOrderStorageKey = `year-${year}/month-${month}/topic-order`;
  localStorage.setItem(topicOrderStorageKey, JSON.stringify(topicOrder));
}

export function localStorageSetMonthlyTopics(year: number, month: number, topics: Array<MonthlyTopicData>) {
  for (let topicId = 0; topicId < topics.length; topicId++) {
    localStorageSetMonthlyTopicData(year, month, topicId, topics[topicId]);
  }
}

export function localStorageSetMonthData(year: number, month: number, monthData: MonthData) {
  localStorageSetMonthlyTopicOrder(year, month, monthData.order);
  localStorageSetMonthlyTopics(year, month, monthData.topics);
}
