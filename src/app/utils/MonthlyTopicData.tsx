import EventData from "./EventData"

type MonthlyTopicData = {
  name: string,
  events: Array<EventData>,
}

type CalendarDataRecord = {
  [key: string]: {
    [key: string]: {
      name?: string;
      events?: Array<EventData>;
      [key: string]: unknown;
    };
  };
}

export default MonthlyTopicData;

export function localStorageMonthlyTopicNameKey(userId: string | null, year: number, month: number, topicId: number) : string {
  if (userId) {
    return `user-${userId}/year-${year}/month-${month}/topic-${topicId}/name`;
  } else {
    return `year-${year}/month-${month}/topic-${topicId}/name`;
  }
}

export function localStorageMonthlyTopicEventsKey(userId: string | null, year: number, month: number, topicId: number) : string {
  if (userId) {
    return `user-${userId}/year-${year}/month-${month}/topic-${topicId}/events`;
  } else {
    return `year-${year}/month-${month}/topic-${topicId}/events`;
  }
}

export function localStorageMonthlyTopicData(userId: string | null, year: number, month: number, topicId: number) : MonthlyTopicData {
  return {
    name: localStorageMonthlyTopicName(userId, year, month, topicId),
    events: localStorageMonthlyTopicEvents(userId, year, month, topicId),
  }
}

export function localStorageMonthlyTopicName(userId: string | null, year: number, month: number, topicId: number) : string {
  return localStorage.getItem(localStorageMonthlyTopicNameKey(userId, year, month, topicId)) || "";
}

export function localStorageMonthlyTopicEvents(userId: string | null, year: number, month: number, topicId: number) : Array<EventData> {
  const saved = localStorage.getItem(localStorageMonthlyTopicEventsKey(userId, year, month, topicId));
  return saved ? JSON.parse(saved) : [];
}

export function localStorageSetMonthlyTopicName(userId: string | null, year: number, month: number, topicId: number, topicName: string) {
  localStorage.setItem(localStorageMonthlyTopicNameKey(userId, year, month, topicId), topicName);
}

export function localStorageSetMonthlyTopicEvents(userId: string | null, year: number, month: number, topicId: number, events: Array<EventData>) {
  localStorage.setItem(localStorageMonthlyTopicEventsKey(userId, year, month, topicId), JSON.stringify(events));
}

export function localStorageSetMonthlyTopicData(userId: string | null, year: number, month: number, topicId: number, topic: MonthlyTopicData) {
  localStorageSetMonthlyTopicName(userId, year, month, topicId, topic.name);
  localStorageSetMonthlyTopicEvents(userId, year, month, topicId, topic.events);
}

export function localStorageClearMonthlyTopic(userId: string | null, year: number, month: number, topicId: number) {
  localStorageSetMonthlyTopicData(userId, year, month, topicId, {
    name: "",
    events: [],
  })
}
