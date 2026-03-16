import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    // 1. Get the pending transaction
    const tx = await sql`SELECT * FROM transactions WHERE id = ${transactionId} AND status = 'pending'`;
    if (tx.length === 0) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    const { user_id, amount } = tx[0];

    // 2. Deduct Balance and Complete Transaction
    await sql`UPDATE users SET balance = balance - ${amount} WHERE id = ${user_id}`;
    await sql`UPDATE transactions SET status = 'completed' WHERE id = ${transactionId}`;

    return NextResponse.json({ success: true, message: "Funds deducted and request completed." });
  } catch (err) {
    return NextResponse.json({ message: "Approval failed" }, { status: 500 });
  }
}