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

    // 2. Perform the update: Add balance and Mark as completed
    // We execute these one after the other.
    
    // Add money to the user's balance
    await sql`
      UPDATE users 
      SET balance = balance + ${tx.amount} 
      WHERE id = ${tx.user_id}
    `;

    // Mark the transaction as completed so it can't be approved again
    await sql`
      UPDATE transactions 
      SET status = 'completed' 
      WHERE id = ${transactionId}
    `;

    return NextResponse.json({ message: "Approved successfully!" });
    
  } catch (error: any) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { message: "Server error during approval" }, 
      { status: 500 }
    );
  }
}