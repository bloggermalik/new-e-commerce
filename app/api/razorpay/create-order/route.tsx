
// /api/razorpay/create-order

import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/db/drizzle";
import { orders, orderItems } from "@/db/schema";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, items, shippingAddress, phone } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // ✅ Initialize Razorpay here (runtime, not build time)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // ---- Compute totals ----
    const subtotal = items.reduce(
      (acc: number, it: any) => acc + Number(it.price) * Number(it.quantity),
      0
    );
    const total = subtotal;

    // ---- Create local order ----
    const orderId = randomUUID();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    await db.insert(orders).values({
      id: orderId,
      userId,
      orderNumber,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "razorpay",
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
      shippingAddress: shippingAddress || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (const it of items) {
      await db.insert(orderItems).values({
        id: randomUUID(),
        orderId,
        productId: it.productId,
        quantity: it.quantity,
        price: it.price.toFixed(2),
        total: (it.price * it.quantity).toFixed(2),
        createdAt: new Date(),
      });
    }

    // ---- Create Razorpay order ----
    const razorOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: orderNumber,
      payment_capture: true,
    });

    return NextResponse.json({
      ok: true,
      razorpayOrderId: razorOrder.id,
      amount: razorOrder.amount,
      currency: razorOrder.currency,
      localOrderId: orderId,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
