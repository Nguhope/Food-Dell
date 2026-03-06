import express from "express";
import authMiddleware from "../middleware/auth.js";
import { 
  placeOrder, 
  verifyOrder, 
  userOrders, 
  listOrders, 
  updateStatus 
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Protected routes (require authentication)
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/status", authMiddleware, updateStatus); // Added auth middleware

// Admin route (consider adding admin middleware)
orderRouter.get("/list", listOrders);

// Public route (for Stripe verification)
orderRouter.post("/verify", verifyOrder);

export default orderRouter;