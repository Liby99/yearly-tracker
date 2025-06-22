import EventData from "./EventData"

type MonthlyTopicData = {
  name: string,
  events: Array<EventData>,
}

export default MonthlyTopicData;

export function localStorageMonthlyTopicNameKey(year: number, month: number, topicId: number) : string {
  return `year-${year}/month-${month}/topic-${topicId}/name`;
}

export function localStorageMonthlyTopicEventsKey(year: number, month: number, topicId: number) : string {
  return `year-${year}/month-${month}/topic-${topicId}/events`;
}

export function localStorageMonthlyTopicData(year: number, month: number, topicId: number) : MonthlyTopicData {
  return {
    name: localStorageMonthlyTopicName(year, month, topicId),
    events: localStorageMonthlyTopicEvents(year, month, topicId),
  }
}

export function localStorageMonthlyTopicName(year: number, month: number, topicId: number) : string {
  return localStorage.getItem(localStorageMonthlyTopicNameKey(year, month, topicId)) || "";
}

export function localStorageMonthlyTopicEvents(year: number, month: number, topicId: number) : Array<EventData> {
  const saved = localStorage.getItem(localStorageMonthlyTopicEventsKey(year, month, topicId));
  return saved ? JSON.parse(saved) : [];
}

export function localStorageSetMonthlyTopicName(year: number, month: number, topicId: number, topicName: string) {
  localStorage.setItem(localStorageMonthlyTopicNameKey(year, month, topicId), topicName);
}

export function localStorageSetMonthlyTopicEvents(year: number, month: number, topicId: number, events: Array<EventData>) {
  localStorage.setItem(localStorageMonthlyTopicEventsKey(year, month, topicId), JSON.stringify(events));
}

export function localStorageSetMonthlyTopicData(year: number, month: number, topicId: number, topic: MonthlyTopicData) {
  localStorageSetMonthlyTopicName(year, month, topicId, topic.name);
  localStorageSetMonthlyTopicEvents(year, month, topicId, topic.events);
}

export function localStorageClearMonthlyTopic(year: number, month: number, topicId: number) {
  localStorageSetMonthlyTopicData(year, month, topicId, {
    name: "",
    events: [],
  })
}
