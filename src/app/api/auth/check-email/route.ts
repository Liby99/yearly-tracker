import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true } // Only get the ID to check existence
    });

    return NextResponse.json({ exists: !!existingUser });
  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 