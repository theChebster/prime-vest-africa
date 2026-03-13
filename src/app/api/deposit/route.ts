import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, amount, network, referenceId } = await req.json();

    // Log a PENDING transaction
    await sql`
      INSERT INTO transactions (user_id, type, amount, network, reference_id, status)
      VALUES (${userId}, 'deposit', ${amount}, ${network}, ${referenceId}, 'pending')
    `;

    return NextResponse.json({ message: "Deposit submitted for approval" });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 });
  }
}