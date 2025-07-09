import MonthlyTopicData, { 
  localStorageMonthlyTopicData, 
  localStorageSetMonthlyTopicData, 
  localStorageClearMonthlyTopic,
  databaseMonthlyTopicData,
  databaseSetMonthlyTopicData,
  databaseClearMonthlyTopic
} from "./MonthlyTopicData";

type MonthData = {
  order: Array<number>,
  topics: Array<MonthlyTopicData>,
}

type CalendarDataRecord = {
  [key: string]: {
    topicOrder?: Array<number>;
    [key: string]: unknown;
  };
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

export function localStorageClearMonthData(year: number, month: number) {
  localStorageSetMonthlyTopicOrder(year, month, DEFAULT_TOPICS_IDS);
  for (const topicId of DEFAULT_TOPICS_IDS) {
    localStorageClearMonthlyTopic(year, month, topicId);
  }
}

// Database functions (async versions)
export async function databaseMonthData(userId: string, year: number, month: number) : Promise<MonthData> {
  return {
    order: await databaseMonthlyTopicOrder(userId, year, month),
    topics: await Promise.all(DEFAULT_TOPICS_IDS.map(topicId => databaseMonthlyTopicData(userId, year, month, topicId))),
  }
}

export async function databaseMonthlyTopicOrder(userId: string, year: number, month: number) : Promise<Array<number>> {
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
    
    if (!calendarData?.data) return DEFAULT_TOPICS_IDS;
    
    const data = calendarData.data as CalendarDataRecord;
    const monthKey = `month-${month}`;
    return data[monthKey]?.topicOrder || DEFAULT_TOPICS_IDS;
  } catch (error) {
    console.error("Error fetching monthly topic order from database:", error);
    return DEFAULT_TOPICS_IDS;
  }
}

export async function databaseSetMonthlyTopicOrder(userId: string, year: number, month: number, topicOrder: Array<number>) {
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
    
    // Update the specific month's topic order
    const updatedData = {
      ...currentData,
      [monthKey]: {
        ...currentData[monthKey],
        topicOrder,
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
    console.error("Error saving monthly topic order to database:", error);
  }
}

export async function databaseSetMonthlyTopics(userId: string, year: number, month: number, topics: Array<MonthlyTopicData>) {
  for (let topicId = 0; topicId < topics.length; topicId++) {
    await databaseSetMonthlyTopicData(userId, year, month, topicId, topics[topicId]);
  }
}

export async function databaseSetMonthData(userId: string, year: number, month: number, monthData: MonthData) {
  await databaseSetMonthlyTopicOrder(userId, year, month, monthData.order);
  await databaseSetMonthlyTopics(userId, year, month, monthData.topics);
}

export async function databaseClearMonthData(userId: string, year: number, month: number) {
  await databaseSetMonthlyTopicOrder(userId, year, month, DEFAULT_TOPICS_IDS);
  for (const topicId of DEFAULT_TOPICS_IDS) {
    await databaseClearMonthlyTopic(userId, year, month, topicId);
  }
}
