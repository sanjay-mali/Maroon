import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    // Get the order details from the request body
    const data = await req.json();
    const { amount, currency = "INR", receipt, notes } = data;
    
    // Validate the required data
    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    // Initialize Razorpay instance with keys from environment variables
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_REZORPAY_KEY_ID!,
      key_secret: process.env.NEXT_PUBLIC_REZORPAY_SECRET_KEY!,
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in smallest currency unit (paise for INR)
      currency,
      receipt, // Your internal order ID
      notes,
    });

    // Return the order details to the client
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      // Only return what the client needs to initialize the SDK
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}