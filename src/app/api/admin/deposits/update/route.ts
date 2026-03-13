import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { transactionId, status } = await req.json();

    // 1. First, fetch the transaction to check if it exists and get the amount
    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE id = ${transactionId} AND status = 'pending'
    `;

    const tx = transactions[0];

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // 2. Update the transaction status
    await sql`
      UPDATE transactions 
      SET status = ${status} 
      WHERE id = ${transactionId}
    `;

    // 3. If approved, update the user's balance
    if (status === 'completed') {
      await sql`
        UPDATE users 
        SET balance = balance + ${Number(tx.amount)} 
        WHERE id = ${tx.user_id}
      `;
    }

    return NextResponse.json({ message: "Status updated successfully" });

  } catch (err: any) {
    console.error("Database Error:", err);
    return NextResponse.json({ error: "System error occurred" }, { status: 500 });
  }
}