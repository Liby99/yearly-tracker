import MonthlyTopicData, { 
  localStorageMonthlyTopicData, 
  localStorageSetMonthlyTopicData, 
  localStorageClearMonthlyTopic,
} from "./MonthlyTopicData";

type MonthData = {
  order: Array<number>,
  topics: Array<MonthlyTopicData>,
}

export default MonthData;

export const DEFAULT_TOPICS_IDS = [0, 1, 2, 3];

export function localStorageMonthlyTopicOrderKey(userId: string | undefined, year: number, month: number) : string {
  if (userId) {
    return `user-${userId}/year-${year}/month-${month}/topic-order`;
  } else {
    return `year-${year}/month-${month}/topic-order`;
  }
}

export function localStorageMonthData(userId: string | undefined, year: number, month: number) : MonthData {
  return {
    order: localStorageMonthlyTopicOrder(userId, year, month),
    topics: DEFAULT_TOPICS_IDS.map(topicId => localStorageMonthlyTopicData(userId, year, month, topicId)),
  }
}

export function localStorageMonthlyTopicOrder(userId: string | undefined, year: number, month: number) : Array<number> {
  const topicOrderStorageKey = localStorageMonthlyTopicOrderKey(userId, year, month);
  const saved = localStorage.getItem(topicOrderStorageKey);
  return saved ? JSON.parse(saved) : DEFAULT_TOPICS_IDS;
}

export function localStorageSetMonthlyTopicOrder(userId: string | undefined, year: number, month: number, topicOrder: Array<number>) {
  const topicOrderStorageKey = localStorageMonthlyTopicOrderKey(userId, year, month);
  localStorage.setItem(topicOrderStorageKey, JSON.stringify(topicOrder));
}

export function localStorageSetMonthlyTopics(userId: string | undefined, year: number, month: number, topics: Array<MonthlyTopicData>) {
  for (let topicId = 0; topicId < topics.length; topicId++) {
    localStorageSetMonthlyTopicData(userId, year, month, topicId, topics[topicId]);
  }
}

export function localStorageSetMonthData(userId: string | undefined, year: number, month: number, monthData: MonthData) {
  localStorageSetMonthlyTopicOrder(userId, year, month, monthData.order);
  localStorageSetMonthlyTopics(userId, year, month, monthData.topics);
}

export function localStorageClearMonthData(userId: string | undefined, year: number, month: number) {
  localStorageSetMonthlyTopicOrder(userId, year, month, DEFAULT_TOPICS_IDS);
  for (const topicId of DEFAULT_TOPICS_IDS) {
    localStorageClearMonthlyTopic(userId, year, month, topicId);
  }
}
