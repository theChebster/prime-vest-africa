import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    // Mark as rejected so it disappears from the pending list
    await sql`
      UPDATE transactions 
      SET status = 'rejected' 
      WHERE id = ${transactionId}
    `;

    return NextResponse.json({ message: "Transaction rejected" });
  } catch (error: any) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}