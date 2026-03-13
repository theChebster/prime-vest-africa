import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    // 1. Verify user exists and has enough balance
    // @ts-ignore
    const users = await sql`SELECT balance FROM users WHERE id = ${userId}`;
    
    if (!users[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentBalance = Number(users[0].balance);
    if (currentBalance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // 2. Perform transaction (Deduct balance and insert log)
    // @ts-ignore
    await sql`UPDATE users SET balance = balance - ${amount} WHERE id = ${userId}`;
    
    // @ts-ignore
    await sql`
      INSERT INTO transactions (user_id, amount, type, status, created_at)
      VALUES (${userId}, ${amount}, 'withdrawal', 'pending', NOW())
    `;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("USER_WITHDRAW_API_ERROR:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}