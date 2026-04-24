import express from 'express';
import { createOrderController, verifyPaymentController } from '../controllers/paymentController.js';

const paymentrouter = express.Router();

paymentrouter.post("/create-order", createOrderController);
paymentrouter.post("/verify-payment" , verifyPaymentController);

export default paymentrouter;