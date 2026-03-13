import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    // 1. Get the transaction details first
    // @ts-ignore
    const transaction = await sql`SELECT * FROM transactions WHERE id = ${id}`;
    
    if (transaction.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const { user_id, amount, status: currentStatus } = transaction[0];

    // Prevent re-processing if already completed/failed
    if (currentStatus !== 'pending') {
      return NextResponse.json({ error: "Transaction already processed" }, { status: 400 });
    }

    // 2. If Rejected, Refund the user
    if (status === 'failed') {
      // @ts-ignore
      await sql`UPDATE users SET balance = balance + ${amount} WHERE id = ${user_id}`;
    }

    // 3. Update transaction status
    // @ts-ignore
    await sql`UPDATE transactions SET status = ${status} WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}