import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Fetch the latest balance directly from the database
    // @ts-ignore
    const result = await sql`
      SELECT balance FROM users WHERE id = ${userId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ balance: result[0].balance });
  } catch (err: any) {
    console.error("BALANCE_FETCH_ERROR:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}