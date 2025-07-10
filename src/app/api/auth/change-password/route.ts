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

    const { email, oldPassword, newPassword } = await request.json()

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "Email, old password, and new password are required" }, { status: 400 })
    }

    // Verify the email matches the session
    if (email !== session.user.email) {
      return NextResponse.json({ error: "Email mismatch" }, { status: 403 })
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify the old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid old password" }, { status: 401 })
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 