import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    // 1. Fetch transaction with User Tier info to ensure valid context
    const transactions = await sql`
      SELECT t.*, u.j_class 
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ${transactionId} AND t.status = 'pending'
    `;

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ message: "Transaction not found or already processed" }, { status: 404 });
    }

    const tx = transactions[0];

    // 2. Logic Branching: Deposits (+) vs Withdrawals (-)
    if (tx.type === 'deposit') {
      // Approve Deposit: Add to User Balance
      await sql`
        UPDATE users 
        SET balance = balance + ${tx.amount} 
        WHERE id = ${tx.user_id}
      `;
    } 
    else if (tx.type === 'withdrawal') {
      // Double Check: Ensure user hasn't spent the money since the request
      const userCheck = await sql`SELECT balance FROM users WHERE id = ${tx.user_id}`;
      if (Number(userCheck[0].balance) < Number(tx.amount)) {
        return NextResponse.json({ message: "Insufficient User Balance for this Withdrawal" }, { status: 400 });
      }

      // Approve Withdrawal: Deduct from User Balance
      await sql`
        UPDATE users 
        SET balance = balance - ${tx.amount} 
        WHERE id = ${tx.user_id}
      `;
    }

    // 3. Finalize: Mark as completed
    await sql`
      UPDATE transactions 
      SET status = 'completed', processed_at = NOW() 
      WHERE id = ${transactionId}
    `;

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${tx.type} of GHS ${tx.amount}` 
    });

  } catch (error: any) {
    console.error("Admin Approval Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}