import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    // We use a JOIN to get the user's identifier along with the deposit
    // I'm using 'u.id' because we know that exists for sure
    const deposits = await sql`
      SELECT 
        t.*, 
        u.id as user_identifier 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.type = 'deposit' AND t.status = 'pending'
      ORDER BY t.created_at DESC
    `;
    
    return NextResponse.json(deposits);
  } catch (err: any) {
    // THIS LOG WILL SHOW UP IN YOUR VS CODE TERMINAL
    console.error("DEPOSIT_FETCH_ERROR:", err.message);
    
    return NextResponse.json(
      { error: err.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}