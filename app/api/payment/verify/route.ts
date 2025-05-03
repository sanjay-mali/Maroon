import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Get the payment details from the request body
    const data = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    
    // Validate the required data
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    // Create a signature with your secret key and order details to verify the payment
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.NEXT_PUBLIC_REZORPAY_SECRET_KEY!)
      .update(text)
      .digest("hex");

    // Verify that the signature from Razorpay matches our generated signature
    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // If verification is successful, you can now update your database
    // to mark the order as paid, store transaction details, etc.

    // Return success response
    return NextResponse.json({
      success: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}