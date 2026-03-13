import { NextResponse } from "next/server";
import sql from "@/lib/db"; 
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Check if we can even read the request
    const body = await req.json();
    const { fullName, phoneNumber, password } = body;

    if (!fullName || !phoneNumber || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Neon
    const result = await sql`
      INSERT INTO users (name, phone_number, password, balance)
      VALUES (${fullName}, ${phoneNumber}, ${hashedPassword}, 0.00)
      RETURNING id;
    `;

    console.log("Registration successful for:", phoneNumber);

    return NextResponse.json({ message: "Success", id: result[0].id }, { status: 201 });

  } catch (error: any) {
    console.error("SERVER_ERROR:", error.message);
    
    // Check if database connection failed
    if (error.message.includes("authentication failed")) {
      return NextResponse.json({ message: "Database connection error. Check .env password." }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}