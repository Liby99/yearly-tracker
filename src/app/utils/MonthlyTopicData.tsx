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
