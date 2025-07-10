import EventData from "./EventData"

type MonthlyTopicData = {
  name: string,
  events: Array<EventData>,
}

export default MonthlyTopicData;

export function localStorageMonthlyTopicKey(userId: string | undefined, year: number, month: number, topicId: number) : string {
  if (userId) {
    return `user-${userId}/year-${year}/month-${month}/topic-${topicId}`;
  } else {
    return `local/year-${year}/month-${month}/topic-${topicId}`;
  }
}

export function localStorageMonthlyTopicNameKey(userId: string | undefined, year: number, month: number, topicId: number) : string {
  return `${localStorageMonthlyTopicKey(userId, year, month, topicId)}/name`;
}

export function localStorageMonthlyTopicEventsKey(userId: string | undefined, year: number, month: number, topicId: number) : string {
  return `${localStorageMonthlyTopicKey(userId, year, month, topicId)}/events`;
}

export function localStorageMonthlyTopicData(userId: string | undefined, year: number, month: number, topicId: number) : MonthlyTopicData {
  return {
    name: localStorageMonthlyTopicName(userId, year, month, topicId),
    events: localStorageMonthlyTopicEvents(userId, year, month, topicId),
  }
}

export function localStorageMonthlyTopicName(userId: string | undefined, year: number, month: number, topicId: number) : string {
  const key = localStorageMonthlyTopicNameKey(userId, year, month, topicId);
  return localStorage.getItem(key) || "";
}

export function localStorageMonthlyTopicEvents(userId: string | undefined, year: number, month: number, topicId: number) : Array<EventData> {
  const key = localStorageMonthlyTopicEventsKey(userId, year, month, topicId);
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
}

export function localStorageSetMonthlyTopicName(userId: string | undefined, year: number, month: number, topicId: number, topicName: string) {
  const key = localStorageMonthlyTopicNameKey(userId, year, month, topicId);
  localStorage.setItem(key, topicName);
}

export function localStorageSetMonthlyTopicEvents(userId: string | undefined, year: number, month: number, topicId: number, events: Array<EventData>) {
  const key = localStorageMonthlyTopicEventsKey(userId, year, month, topicId);
  localStorage.setItem(key, JSON.stringify(events));
}

export function localStorageSetMonthlyTopicData(userId: string | undefined, year: number, month: number, topicId: number, topic: MonthlyTopicData) {
  localStorageSetMonthlyTopicName(userId, year, month, topicId, topic.name);
  localStorageSetMonthlyTopicEvents(userId, year, month, topicId, topic.events);
}

export function localStorageClearMonthlyTopic(userId: string | undefined, year: number, month: number, topicId: number) {
  localStorageSetMonthlyTopicData(userId, year, month, topicId, {
    name: "",
    events: [],
  })
}
