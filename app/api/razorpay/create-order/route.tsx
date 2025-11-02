// // app/api/razorpay/create-order/route.ts
// import { NextResponse } from "next/server";
// import Razorpay from "razorpay";
// import { orders, orderItems } from "@/db/schema"; // paths to your drizzle schema
// import { db } from "@/db/drizzle";
// import { v4 as uuidv4 } from "uuid";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json(); 
//     // body expected: { userId, items: [{ productId, quantity, price }], shippingAddress, phone, ... }
//     const { userId, items, shippingAddress, phone } = body;

//     if (!userId || !items || items.length === 0) {
//       return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
//     }

//     // calculate totals (be careful to use strings for numeric fields in drizzle numeric columns)
//     const subtotal = items.reduce((s: number, it: any) => s + Number(it.price) * Number(it.quantity), 0);
//     const tax = 0; // compute if applicable
//     const discount = 0;
//     const total = subtotal + tax - discount;

//     // create local order in DB (status 'pending', paymentStatus 'pending')
//     const orderId = uuidv4();
//     const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${orderId.slice(0,6).toUpperCase()}`;

//     await db.insert(orders).values({
//       id: orderId,
//       userId,
//       orderNumber,
//       status: "pending",
//       paymentStatus: "pending",
//       paymentMethod: "razorpay",
//       subtotal: subtotal.toFixed(2),
//       tax: tax.toFixed(2),
//       discount: discount.toFixed(2),
//       total: total.toFixed(2),
//       shippingAddress: shippingAddress || "",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     // insert order_items
//     for (const it of items) {
//       const itemId = uuidv4();
//       await db.insert(orderItems).values({
//         id: itemId,
//         orderId,
//         productId: it.productId,
//         quantity: it.quantity,
//         price: Number(it.price).toFixed(2),
//         total: (Number(it.price) * Number(it.quantity)).toFixed(2),
//         createdAt: new Date(),
//       });
//     }

//     // create razorpay order (amount must be integer in paise)
//     const amountInPaise = Math.round(total * 100); // e.g. ₹500.50 -> 50050
//     const rOrder = await razorpay.orders.create({
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: orderNumber,
//       payment_capture: true,
//  // auto capture (or 0 to capture manually)
//     });

//     return NextResponse.json({
//       ok: true,
//       razorpayOrderId: rOrder.id,
//       amount: rOrder.amount,
//       currency: rOrder.currency,
//       localOrderId: orderId,
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//     });
//   } catch (err: any) {
//     console.error("create-order error", err);
//     return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
//   }
// }



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
