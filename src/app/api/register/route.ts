import { NextResponse } from "next/server";
import sql from "@/lib/db"; 
import bcrypt from "bcryptjs";

// ADD THIS FOR TESTING
export async function GET() {
  return NextResponse.json({ message: "API is reachable on this device!" });
}

export async function POST(req: Request) {
  // ... (keep your existing POST code here)
  try {
    const { fullName, phoneNumber, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await sql`
      INSERT INTO users (name, phone_number, password, balance)
      VALUES (${fullName}, ${phoneNumber}, ${hashedPassword}, 0)
      RETURNING id;
    `;
    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}