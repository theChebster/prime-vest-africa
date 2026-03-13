import { NextResponse } from "next/server";
import sql from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { phoneNumber, password } = await req.json();

    // 1. Find user by phone number
    const users = await sql`SELECT * FROM users WHERE phone_number = ${phoneNumber}`;
    
    if (users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // 3. Return user data (excluding sensitive password)
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        balance: user.balance,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}