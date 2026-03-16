import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ message: "Transaction ID required" }, { status: 400 });
    }

    // 1. Fetch transaction
    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE id = ${transactionId} AND status = 'pending'
    `;

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ message: "Transaction not found or already processed" }, { status: 404 });
    }

    const tx = transactions[0];
    const txType = tx.type ? tx.type.toLowerCase() : 'deposit';

    // 2. Execute updates sequentially (Neon compatible)
    if (txType === 'deposit') {
      await sql`
        UPDATE users 
        SET balance = balance + ${tx.amount} 
        WHERE id = ${tx.user_id}
      `;
    } else if (txType === 'withdrawal') {
      const users = await sql`SELECT balance FROM users WHERE id = ${tx.user_id}`;
      if (!users[0] || Number(users[0].balance) < Number(tx.amount)) {
        return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
      }
      await sql`
        UPDATE users 
        SET balance = balance - ${tx.amount} 
        WHERE id = ${tx.user_id}
      `;
    }

    // 3. Mark as completed
    await sql`
      UPDATE transactions 
      SET status = 'completed' 
      WHERE id = ${transactionId}
    `;

    return NextResponse.json({ 
      success: true,
      message: `Successfully approved ${txType} of GHS ${tx.amount}` 
    });
    
  } catch (error: any) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}