import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    // Get count of users
    const userCount = await sql`SELECT COUNT(*) FROM users`;
    // Sum of all balances
    const balanceSum = await sql`SELECT SUM(balance) FROM users`;
    // Count pending deposits
    const deposits = await sql`SELECT COUNT(*) FROM transactions WHERE type = 'deposit' AND status = 'pending'`;
    // Count pending withdrawals
    const withdrawals = await sql`SELECT COUNT(*) FROM transactions WHERE type = 'withdrawal' AND status = 'pending'`;

    return NextResponse.json({
      totalUsers: parseInt(userCount[0].count),
      totalBalance: parseFloat(balanceSum[0].sum || 0),
      pendingDeposits: parseInt(deposits[0].count),
      pendingWithdrawals: parseInt(withdrawals[0].count)
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}