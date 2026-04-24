import Course from "../models/courseModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export async function createOrderController(req, res) {
  try {
    const { id } = req.body;

    console.log(id);
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const amount = course?.price * 100;
    const currency = "INR";
    const receipt = `receipt_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    return res.json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
}

export async function verifyPaymentController(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment data",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
}
