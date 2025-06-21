import EventData from "./EventData"

type MonthlyTopicData = {
  name: string,
  events: Array<EventData>,
}

export default MonthlyTopicData;

export function localStorageMonthlyTopicData(year: number, month: number, topicId: number) : MonthlyTopicData {
  return {
    name: localStorageMonthlyTopicName(year, month, topicId),
    events: localStorageMonthlyTopicEvents(year, month, topicId),
  }
}

export function localStorageMonthlyTopicName(year: number, month: number, topicId: number) : string {
  return localStorage.getItem(`year-${year}/month-${month}/topic-${topicId}/topic`) || "";
}

export function localStorageMonthlyTopicEvents(year: number, month: number, topicId: number) : Array<EventData> {
  const saved = localStorage.getItem(`year-${year}/month-${month}/topic-${topicId}/events`);
  return saved ? JSON.parse(saved) : [];
}

export function localStorageSetMonthlyTopicName(year: number, month: number, topicId: number, topicName: string) {
  localStorage.setItem(`year-${year}/month-${month}/topic-${topicId}/topic`, topicName);
}

export function localStorageSetMonthlyTopicEvents(year: number, month: number, topicId: number, events: Array<EventData>) {
  localStorage.setItem(`year-${year}/month-${month}/topic-${topicId}/events`, JSON.stringify(events));
}

export function localStorageSetMonthlyTopicData(year: number, month: number, topicId: number, topic: MonthlyTopicData) {
  localStorageSetMonthlyTopicName(year, month, topicId, topic.name);
  localStorageSetMonthlyTopicEvents(year, month, topicId, topic.events);
}
