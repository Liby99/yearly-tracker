import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../utils/AuthOptions"
import { prisma } from "../../../../lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Verify the email matches the session
    if (email !== session.user.email) {
      return NextResponse.json({ error: "Email mismatch" }, { status: 403 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify the password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 