import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // We select the ID, Name, Phone, and Balance
    // @ts-ignore
    const users = await sql`
      SELECT id, name, phone, balance, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(users);
  } catch (err: any) {
    console.error("ADMIN_FETCH_USERS_ERROR:", err.message);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}