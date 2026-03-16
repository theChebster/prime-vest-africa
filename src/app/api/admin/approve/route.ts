import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    // 1. Get the transaction details
    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE id = ${transactionId} AND status = 'pending'
    `;

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ message: "Transaction not found or already processed" }, { status: 404 });
    }

    const tx = transactions[0];

    // 2. Logic Branching: Deposit (+) vs Withdrawal (-)
    if (tx.type === 'deposit') {
      // Add money to the user's balance
      await sql`
        UPDATE users 
        SET balance = balance + ${tx.amount} 
        WHERE id = ${tx.user_id}
      `;
    } else if (tx.type === 'withdrawal') {
      // Final check: Does the user still have the money?
      const users = await sql`SELECT balance FROM users WHERE id = ${tx.user_id}`;
      if (Number(users[0].balance) < Number(tx.amount)) {
        return NextResponse.json({ message: "User no longer has sufficient balance" }, { status: 400 });
      }

      // Deduct money from the user's balance
      await sql`
        UPDATE users 
        SET balance = balance - ${tx.amount} 
        WHERE id = ${tx.user_id}
      `;
    }

    // 3. Mark the transaction as completed
    await sql`
      UPDATE transactions 
      SET status = 'completed' 
      WHERE id = ${transactionId}
    `;

    return NextResponse.json({ 
      message: `Successfully approved ${tx.type} of GHS ${tx.amount}` 
    });
    
  } catch (error: any) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { message: "Server error during approval" }, 
      { status: 500 }
    );
  }
}