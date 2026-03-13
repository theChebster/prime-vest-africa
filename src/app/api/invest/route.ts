import { NextResponse } from "next/server";
import sql from "@/lib/db";

const PLANS: any = {
  1: { brand: "Samsung", price: 50, daily: 2.50, minClass: 1 },
  2: { brand: "Apple", price: 200, daily: 12.00, minClass: 2 },
  3: { brand: "Tesla", price: 1000, daily: 70.00, minClass: 3 },
  4: { brand: "Amazon", price: 5000, daily: 400.00, minClass: 4 },
};

export async function POST(req: Request) {
  try {
    const { userId, planId } = await req.json();
    const plan = PLANS[planId];

    // 1. Get user data
    const users = await sql`SELECT balance, j_class FROM users WHERE id = ${userId}`;
    if (users.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 });
    
    const user = users[0];

    // 2. Check J-Class Eligibility
    if (user.j_class < plan.minClass) {
      return NextResponse.json({ message: `Level J-Class ${plan.minClass} required!` }, { status: 403 });
    }

    // 3. Check Balance
    if (parseFloat(user.balance) < plan.price) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
    }

    // 4. Run Transaction: Deduct money and start investment
    await sql`
      UPDATE users SET balance = balance - ${plan.price} WHERE id = ${userId}
    `;
    
    await sql`
      INSERT INTO active_investments (user_id, brand_name, amount_invested, daily_profit) 
      VALUES (${userId}, ${plan.brand}, ${plan.price}, ${plan.daily})
    `;

    return NextResponse.json({ message: "Invested successfully" });

  } catch (err: any) {
    console.error("INVEST_API_ERROR:", err.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}