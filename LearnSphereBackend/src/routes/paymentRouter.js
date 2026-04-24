import express from 'express';
import { createOrderController } from '../controllers/paymentController.js';

const paymentrouter = express.Router();

paymentrouter.post("/create-order", createOrderController);

export default paymentrouter;