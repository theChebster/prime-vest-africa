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

    if (!userId) return NextResponse.json({ message: "Auth required" }, { status: 401 });

    // 1. Fetch user data
    const users = await sql`SELECT j_class, balance FROM users WHERE id = ${userId}`;
    if (users.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 });
    
    const userTier = users[0].j_class || "Intern";
    const config = TIER_CONFIG[userTier];

    // 2. Count videos watched today
    // Note: Neon returns rows as an array, so we access [0]
    const watchCountResult = await sql`
      SELECT COUNT(*)::int as count FROM video_earnings 
      WHERE user_id = ${userId} 
      AND watched_at >= CURRENT_DATE
    `;
    
    const count = watchCountResult[0].count;

    // 3. Check if limit reached
    if (count >= config.videos) {
      return NextResponse.json({ 
        message: `Daily tasks complete for ${userTier}!` 
      }, { status: 400 });
    }

    // 4. Calculate reward (rounding to 2 decimal places)
    const rewardPerVideo = parseFloat((config.dailyTotal / config.videos).toFixed(2));

    // 5. Update Balance
    await sql`
      UPDATE users 
      SET balance = balance + ${rewardPerVideo} 
      WHERE id = ${userId}
    `;
    
    // 6. Record the watch event
    await sql`
      INSERT INTO video_earnings (user_id, video_id, amount, watched_at) 
      VALUES (${userId}, ${videoId || 'gen_vid'}, ${rewardPerVideo}, NOW())
    `;

    return NextResponse.json({ 
      message: `Reward claimed!`,
      stats: {
        completed: count + 1,
        total: config.videos,
        remaining: config.videos - (count + 1)
      }
    });

  } catch (err: any) {
    console.error("WATCH_EARN_ERROR:", err.message);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}