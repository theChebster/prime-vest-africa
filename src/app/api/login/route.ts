import { NextResponse } from "next/server";
import sql from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { phoneNumber, password } = await req.json();

    // 1. HARDCODED ADMIN CHECK
    // Use quotes for the phone number to preserve the leading zero
    if (phoneNumber === '0256991802' && password === 'alaves') {
      return NextResponse.json({
        message: "Admin access granted",
        user: {
          id: 999,
          name: "System Administrator",
          balance: 0.00,
          phoneNumber: '0256991802', // Fixed: Added quotes
          is_admin: true 
        }
      });
    }

    // 2. REGULAR USER LOGIN
    const users = await sql`SELECT * FROM users WHERE phone_number = ${phoneNumber}`;
    
    if (users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        balance: user.balance,
        phoneNumber: user.phone_number, // Ensure this matches your frontend expectations
        is_admin: Boolean(user.is_admin) 
      }
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Server error", details: error.message }, { status: 500 });
  }
}
