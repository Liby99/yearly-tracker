import { prisma } from "@/lib/prisma"

export interface SyncStatus {
  isSynced: boolean
  lastSync: Date | null
  hasLocalChanges: boolean
}

export async function syncToDatabase(userId: string, year: number, data: any) {
  try {
    await prisma.calendarData.upsert({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
      update: {
        data,
        updatedAt: new Date(),
      },
      create: {
        userId,
        year,
        data,
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Sync error:", error)
    return { success: false, error }
  }
}

export async function syncFromDatabase(userId: string, year: number) {
  try {
    const calendarData = await prisma.calendarData.findUnique({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
    })
    return { success: true, data: calendarData?.data || null }
  } catch (error) {
    console.error("Sync error:", error)
    return { success: false, error }
  }
}

export function getLocalStorageData(year: number) {
  // Collect all localStorage data for the year
  const data: any = {};
  
  // Get quarterly notes for all quarters
  for (let quarter = 1; quarter <= 4; quarter++) {
    const { localStorageQuarterlyNotes } = require("./QuarterlyNoteData");
    data[`quarter-${quarter}`] = {
      notes: localStorageQuarterlyNotes(year, quarter)
    };
  }
  
  // Get monthly data for all months
  for (let month = 1; month <= 12; month++) {
    const { localStorageMonthData } = require("./MonthData");
    const monthData = localStorageMonthData(year, month);
    data[`month-${month}`] = {
      topicOrder: monthData.order,
      topics: monthData.topics
    };
  }
  
  return data;
}

export function setLocalStorageData(year: number, data: any) {
  if (!data) return;
  
  // Set quarterly notes for all quarters
  for (let quarter = 1; quarter <= 4; quarter++) {
    const quarterKey = `quarter-${quarter}`;
    if (data[quarterKey]?.notes) {
      const { localStorageSetQuarterlyNotes } = require("./QuarterlyNoteData");
      localStorageSetQuarterlyNotes(year, quarter, data[quarterKey].notes);
    }
  }
  
  // Set monthly data for all months
  for (let month = 1; month <= 12; month++) {
    const monthKey = `month-${month}`;
    if (data[monthKey]) {
      const { localStorageSetMonthlyTopicOrder, localStorageSetMonthlyTopicData } = require("./MonthData");
      const { localStorageSetMonthlyTopicName, localStorageSetMonthlyTopicEvents } = require("./MonthlyTopicData");
      
      // Set topic order
      if (data[monthKey].topicOrder) {
        localStorageSetMonthlyTopicOrder(year, month, data[monthKey].topicOrder);
      }
      
      // Set topics
      if (data[monthKey].topics) {
        data[monthKey].topics.forEach((topic: any, topicId: number) => {
          localStorageSetMonthlyTopicName(year, month, topicId, topic.name);
          localStorageSetMonthlyTopicEvents(year, month, topicId, topic.events);
        });
      }
    }
  }
} 