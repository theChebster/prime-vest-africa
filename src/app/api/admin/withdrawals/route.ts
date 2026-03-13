import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // This fetches the pending requests for your Admin Table
    // @ts-ignore
    const data = await sql`
      SELECT id, user_id, amount, status, created_at 
      FROM transactions 
      WHERE type = 'withdrawal' AND status = 'pending' 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET_WITHDRAWALS_ERROR:", err.message);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}