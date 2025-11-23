// app/api/razorpay/verify-payment/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !localOrderId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // verify signature
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = shasum.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      // invalid signature
      // update DB: paymentStatus failed (optional)
      await db.update(orders).set({
        paymentStatus: "failed",
        updatedAt: new Date(),
      }).where(eq(orders.id,localOrderId)); // or eq(orders.id, localOrderId) depending on your helper
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
    }

    // signature valid — update DB
    await db.update(orders).set({
      paymentStatus: "paid",
      transactionId: razorpay_payment_id,
      status: "processing",
      updatedAt: new Date(),
    }).where(eq(orders.id ,localOrderId));

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("verify-payment error", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
