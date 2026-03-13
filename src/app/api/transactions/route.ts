import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  try {
    let history;
    
    if (status === "pending") {
      // Admin request: Get all pending transactions
      history = await sql`SELECT * FROM transactions WHERE status = 'pending' ORDER BY created_at ASC`;
    } else if (userId) {
      // User request: Get history for one user
      history = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 10`;
    } else {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}