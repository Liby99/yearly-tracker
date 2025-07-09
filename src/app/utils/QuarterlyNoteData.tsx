type QuarterlyNoteData = {
  i: number,
  j: number,
  w: number,
  h: number,
  content: string,
  color: string | null,
}

export default QuarterlyNoteData;

export function quarterlyNoteContainsCell(note: QuarterlyNoteData, i: number, j: number) : boolean {
  return (
    note.i <= i &&
    i < note.i + note.h &&
    note.j <= j &&
    j < note.j + note.w
  );
}

// LocalStorage functions
export function localStorageQuarterlyNotesKey(year: number, quarter: number) : string {
  return `year-${year}/quarter-${quarter}/notes`;
}

export function localStorageQuarterlyNotes(year: number, quarter: number) : Array<QuarterlyNoteData> {
  const saved = localStorage.getItem(localStorageQuarterlyNotesKey(year, quarter));
  return saved ? JSON.parse(saved) : [];
}

export function localStorageSetQuarterlyNotes(year: number, quarter: number, notes: Array<QuarterlyNoteData>) {
  localStorage.setItem(localStorageQuarterlyNotesKey(year, quarter), JSON.stringify(notes));
}

export function localStorageClearQuarterlyNotes(year: number, quarter: number) {
  localStorageSetQuarterlyNotes(year, quarter, [])
}

// Database functions (async versions)
export function databaseQuarterlyNotesKey(userId: string, year: number, quarter: number) : string {
  return `user-${userId}/year-${year}/quarter-${quarter}/notes`;
}

export async function databaseQuarterlyNotes(userId: string, year: number, quarter: number) : Promise<Array<QuarterlyNoteData>> {
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
    
    const data = calendarData.data as any;
    const quarterKey = `quarter-${quarter}`;
    return data[quarterKey]?.notes || [];
  } catch (error) {
    console.error("Error fetching quarterly notes from database:", error);
    return [];
  }
}

export async function databaseSetQuarterlyNotes(userId: string, year: number, quarter: number, notes: Array<QuarterlyNoteData>) {
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
    
    const currentData = existingData?.data as any || {};
    const quarterKey = `quarter-${quarter}`;
    
    // Update the specific quarter's notes
    const updatedData = {
      ...currentData,
      [quarterKey]: {
        ...currentData[quarterKey],
        notes,
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
    console.error("Error saving quarterly notes to database:", error);
  }
}

export async function databaseClearQuarterlyNotes(userId: string, year: number, quarter: number) {
  await databaseSetQuarterlyNotes(userId, year, quarter, []);
}
