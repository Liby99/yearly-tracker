import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

// GET - Retrieve calendar data for a specific year
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Authentication required",
        message: "Please sign in to access your calendar data"
      }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const year = parseInt(searchParams.get("year") || "0")
    
    if (!year) {
      return NextResponse.json({ error: "Year parameter required" }, { status: 400 })
    }

    const calendarData = await prisma.calendarData.findUnique({
      where: {
        userId_year: {
          userId: session.user.id,
          year
        }
      }
    })

    if (!calendarData) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 })
    }

    return NextResponse.json({
      data: calendarData.data,
      version: calendarData.updatedAt.getTime(),
      lastModified: calendarData.updatedAt
    })
  } catch (error) {
    console.error("GET calendar data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Upload calendar data (no conflict checking)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "Authentication required",
        message: "Please sign in to save your calendar data"
      }, { status: 401 })
    }

    const { userId: requestUserId, year, data, force } = await req.json()
    
    if (!requestUserId || !year || !data) {
      return NextResponse.json({ error: "User ID, year, and data required" }, { status: 400 })
    }

    // Verify user owns this data
    if (requestUserId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized - User ID mismatch" }, { status: 401 })
    }

    // Upsert the data (no conflict checking)
    const result = await prisma.calendarData.upsert({
      where: {
        userId_year: {
          userId: session.user.id,
          year
        }
      },
      update: {
        data,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        year,
        data
      }
    })

    return NextResponse.json({
      message: "Data saved successfully",
      version: result.updatedAt.getTime(),
      lastModified: result.updatedAt
    })
  } catch (error) {
    console.error("PUT calendar data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 