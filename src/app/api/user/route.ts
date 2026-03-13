import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();

    // 1. Get balance
    // @ts-ignore
    const users = await sql`SELECT balance FROM users WHERE id = ${userId}`;
    if (!users[0] || users[0].balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // 2. Separate queries to avoid .begin() issues
    // @ts-ignore
    await sql`UPDATE users SET balance = balance - ${amount} WHERE id = ${userId}`;
    // @ts-ignore
    await sql`
      INSERT INTO transactions (user_id, amount, type, status, created_at)
      VALUES (${userId}, ${amount}, 'withdrawal', 'pending', NOW())
    `;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "API Path or DB Error" }, { status: 500 });
  }
}