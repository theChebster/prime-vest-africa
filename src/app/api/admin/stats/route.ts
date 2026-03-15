export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    // 1. Get User Statistics (Total count and System Liability)
    const userStats = await sql`
      SELECT 
        COUNT(id)::int as user_count, 
        COALESCE(SUM(balance), 0)::float as total_liability 
      FROM users
    `;

    // 2. Get Pending Transaction Counts
    const pendingDeposits = await sql`
      SELECT COUNT(id)::int as count 
      FROM transactions 
      WHERE type = 'deposit' AND status = 'pending'
    `;

    const pendingWithdrawals = await sql`
      SELECT COUNT(id)::int as count 
      FROM transactions 
      WHERE type = 'withdrawal' AND status = 'pending'
    `;

    // 3. Get Recent Activity (Last 24 hours)
    const dailyActivity = await sql`
      SELECT COUNT(id)::int as count 
      FROM transactions 
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `;

    return NextResponse.json({
      totalUsers: userStats[0].user_count || 0,
      totalBalance: userStats[0].total_liability || 0,
      pendingDeposits: pendingDeposits[0].count || 0,
      pendingWithdrawals: pendingWithdrawals[0].count || 0,
      dailyActivity: dailyActivity[0].count || 0
    });

  } catch (error: any) {
    console.error("ADMIN_STATS_ERROR:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}