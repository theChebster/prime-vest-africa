import { NextResponse } from "next/server";
import sql from "@/lib/db";

// Configuration based on your income structure PDF
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
    const { userId } = await req.json();

    // 1. Fetch user tier
    const users = await sql`SELECT j_class FROM users WHERE id = ${userId}`;
    if (users.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 });
    
    const userTier = users[0].j_class || "Intern";
    const config = TIER_CONFIG[userTier];

    // 2. Count how many videos they watched TODAY
    const watchCount = await sql`
      SELECT COUNT(id) FROM video_earnings 
      WHERE user_id = ${userId} AND watched_at = CURRENT_DATE
    `;
    
    const count = parseInt(watchCount[0].count);

    // 3. Check if limit reached
    if (count >= config.videos) {
      return NextResponse.json({ 
        message: `Daily limit reached for ${userTier} (${config.videos} videos). Upgrade for more!` 
      }, { status: 400 });
    }

    // 4. Calculate reward per video (Daily Total / Number of Videos)
    const rewardPerVideo = config.dailyTotal / config.videos;

    // 5. Update Balance and Record Watch
    await sql`UPDATE users SET balance = balance + ${rewardPerVideo} WHERE id = ${userId}`;
    await sql`
      INSERT INTO video_earnings (user_id, video_id, amount) 
      VALUES (${userId}, ${'vid_' + (count + 1)}, ${rewardPerVideo})
    `;

    return NextResponse.json({ 
      message: `Reward claimed! (${count + 1}/${config.videos} completed)` 
    });

  } catch (err: any) {
    console.error("WATCH_EARN_ERROR:", err.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}