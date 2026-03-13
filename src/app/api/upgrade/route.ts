import { NextResponse } from "next/server";
import sql from "@/lib/db";

const TIER_PRICES: Record<string, number> = {
  "J1": 150, "J2": 300, "J3": 600, "J4": 1000, "J5": 1500, "J6": 2000, "J7": 3000
};

const RANK_ORDER = ["Intern", "J1", "J2", "J3", "J4", "J5", "J6", "J7"];

export async function POST(req: Request) {
  try {
    const { userId, newLevel } = await req.json();
    const cost = TIER_PRICES[newLevel];

    if (!cost) {
      return NextResponse.json({ message: "Invalid Job Class" }, { status: 400 });
    }

    // 1. Fetch user data
    const users = await sql`SELECT balance, j_class FROM users WHERE id = ${userId}`;
    if (users.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const user = users[0];
    const currentRank = user.j_class || "Intern";

    // 2. Rank Check
    const currentIndex = RANK_ORDER.indexOf(currentRank);
    const newIndex = RANK_ORDER.indexOf(newLevel);

    if (newIndex <= currentIndex) {
      return NextResponse.json({ 
        message: `Current Rank: ${currentRank}. You can only upgrade to a higher rank.` 
      }, { status: 400 });
    }

    // 3. Balance Check
    if (parseFloat(user.balance) < cost) {
      return NextResponse.json({ 
        message: `Insufficient balance. GHS ${cost.toFixed(2)} required.` 
      }, { status: 400 });
    }

    // 4. Update Database (Sequential version to remove underlines)
    // Step A: Deduct Balance
    await sql`UPDATE users SET balance = balance - ${cost} WHERE id = ${userId}`;
    
    // Step B: Set New J-Class
    await sql`UPDATE users SET j_class = ${newLevel} WHERE id = ${userId}`;
    
    // Step C: Record Transaction
    const refId = 'UPG-' + Date.now();
    await sql`
      INSERT INTO transactions (user_id, type, amount, status, reference_id) 
      VALUES (${userId}, 'upgrade', ${cost}, 'completed', ${refId})
    `;

    return NextResponse.json({ message: `Successfully promoted to ${newLevel}!` });

  } catch (err: any) {
    console.error("UPGRADE_ERROR:", err.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}