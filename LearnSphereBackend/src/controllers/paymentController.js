import Course from "../models/courseModel.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});


export async function createOrderController(req , res){
    try {
        const {id} = req.body;

        console.log(id)
        const course = await Course.findById(id);
        if(!course){
            return res.status(404).json({ message: "Course not found" });
        }

        const amount = course?.price * 100;
        const currency = "INR";
        const receipt = `receipt_${Date.now()}`;

        const order = await razorpay.orders.create({
            amount,
            currency,
            receipt,
        })
        
        return res.json({
            success: true,
            message: "Order created successfully",
            order,
        })
    } catch (error) {
        return res.status(500).json({ message: "Failed to create order", error: error.message });
    }
}