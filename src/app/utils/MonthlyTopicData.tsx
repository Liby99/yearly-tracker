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

// Database functions (async versions)
export function databaseMonthlyTopicNameKey(userId: string, year: number, month: number, topicId: number) : string {
  return `user-${userId}/year-${year}/month-${month}/topic-${topicId}/name`;
}

export function databaseMonthlyTopicEventsKey(userId: string, year: number, month: number, topicId: number) : string {
  return `user-${userId}/year-${year}/month-${month}/topic-${topicId}/events`;
}

export async function databaseMonthlyTopicData(userId: string, year: number, month: number, topicId: number) : Promise<MonthlyTopicData> {
  return {
    name: await databaseMonthlyTopicName(userId, year, month, topicId),
    events: await databaseMonthlyTopicEvents(userId, year, month, topicId),
  }
}

export async function databaseMonthlyTopicName(userId: string, year: number, month: number, topicId: number) : Promise<string> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const calendarData = await prisma.calendarData.findUnique({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
    });
    
    if (!calendarData?.data) return "";
    
    const data = calendarData.data as CalendarDataRecord;
    const monthKey = `month-${month}`;
    const topicKey = `topic-${topicId}`;
    return data[monthKey]?.[topicKey]?.name || "";
  } catch (error) {
    console.error("Error fetching monthly topic name from database:", error);
    return "";
  }
}

export async function databaseMonthlyTopicEvents(userId: string, year: number, month: number, topicId: number) : Promise<Array<EventData>> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const calendarData = await prisma.calendarData.findUnique({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
    });
    
    if (!calendarData?.data) return [];
    
    const data = calendarData.data as CalendarDataRecord;
    const monthKey = `month-${month}`;
    const topicKey = `topic-${topicId}`;
    return data[monthKey]?.[topicKey]?.events || [];
  } catch (error) {
    console.error("Error fetching monthly topic events from database:", error);
    return [];
  }
}

export async function databaseSetMonthlyTopicName(userId: string, year: number, month: number, topicId: number, topicName: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    
    // Get existing data for the year
    const existingData = await prisma.calendarData.findUnique({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
    });
    
    const currentData = existingData?.data as CalendarDataRecord || {};
    const monthKey = `month-${month}`;
    const topicKey = `topic-${topicId}`;
    
    // Update the specific topic's name
    const updatedData = {
      ...currentData,
      [monthKey]: {
        ...currentData[monthKey],
        [topicKey]: {
          ...currentData[monthKey]?.[topicKey],
          name: topicName,
        },
      },
    };
    
    await prisma.calendarData.upsert({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
      update: {
        data: updatedData,
        updatedAt: new Date(),
      },
      create: {
        userId,
        year,
        data: updatedData,
      },
    });
  } catch (error) {
    console.error("Error saving monthly topic name to database:", error);
  }
}

export async function databaseSetMonthlyTopicEvents(userId: string, year: number, month: number, topicId: number, events: Array<EventData>) {
  try {
    const { prisma } = await import("@/lib/prisma");
    
    // Get existing data for the year
    const existingData = await prisma.calendarData.findUnique({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
    });
    
    const currentData = existingData?.data as CalendarDataRecord || {};
    const monthKey = `month-${month}`;
    const topicKey = `topic-${topicId}`;
    
    // Update the specific topic's events
    const updatedData = {
      ...currentData,
      [monthKey]: {
        ...currentData[monthKey],
        [topicKey]: {
          ...currentData[monthKey]?.[topicKey],
          events,
        },
      },
    };
    
    await prisma.calendarData.upsert({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
      update: {
        data: updatedData,
        updatedAt: new Date(),
      },
      create: {
        userId,
        year,
        data: updatedData,
      },
    });
  } catch (error) {
    console.error("Error saving monthly topic events to database:", error);
  }
}

export async function databaseSetMonthlyTopicData(userId: string, year: number, month: number, topicId: number, topic: MonthlyTopicData) {
  await databaseSetMonthlyTopicName(userId, year, month, topicId, topic.name);
  await databaseSetMonthlyTopicEvents(userId, year, month, topicId, topic.events);
}

export async function databaseClearMonthlyTopic(userId: string, year: number, month: number, topicId: number) {
  await databaseSetMonthlyTopicData(userId, year, month, topicId, {
    name: "",
    events: [],
  });
}
