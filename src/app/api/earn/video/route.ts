import { NextResponse } from "next/server";
import sql from "@/lib/db";

const TIER_CONFIG: Record<string, { videos: number; dailyTotal: number }> = {
  "Intern": { videos: 5, dailyTotal: 9.00 },
  "J1": { videos: 10, dailyTotal: 5.75 },
  "J2": { videos: 10, dailyTotal: 11.50 },
  "J3": { videos: 20, dailyTotal: 23.00 },
  "J4": { videos: 20, dailyTotal: 38.33 },
  "J5": { videos: 25, dailyTotal: 57.50 },
  "J6": { videos: 30, dailyTotal: 76.66 },
  "J7": { videos: 40, dailyTotal: 115.00 },
};

export async function POST(req: Request) {
  try {
    const { userId, videoId } = await req.json();

    // 1. Fetch User
    const users = await sql`SELECT j_class, balance FROM users WHERE id = ${userId}`;
    if (users.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 });
    
    const userTier = users[0].j_class || "Intern";
    const config = TIER_CONFIG[userTier];

    // 2. Check Daily Limit
    const watchCountResult = await sql`
      SELECT COUNT(*)::int as count FROM video_earnings 
      WHERE user_id = ${userId} AND watched_at >= CURRENT_DATE
    `;
    const count = watchCountResult[0].count;

    if (count >= config.videos) {
      return NextResponse.json({ message: "Daily limit reached!" }, { status: 400 });
    }

    // 3. Math & Database Updates
    const reward = parseFloat((config.dailyTotal / config.videos).toFixed(2));

    // Update Balance
    await sql`UPDATE users SET balance = balance + ${reward} WHERE id = ${userId}`;
    
    // Add to History (So user sees it in their "Statement")
    await sql`
      INSERT INTO transactions (user_id, amount, type, status, created_at) 
      VALUES (${userId}, ${reward}, 'video_reward', 'completed', NOW())
    `;

    // Log the watch for limit checking
    await sql`
      INSERT INTO video_earnings (user_id, video_id, amount, watched_at) 
      VALUES (${userId}, ${videoId || 'gen_vid'}, ${reward}, NOW())
    `;

    return NextResponse.json({ success: true, rewardAmount: reward });
  } catch (err: any) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}