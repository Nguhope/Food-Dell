import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Constants
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const DELIVERY_CHARGE = 2; // in dollars
const CURRENCY = "usd";

// Helper function for error handling
const handleErrorResponse = (res, statusCode, message) => {
  console.error(message);
  return res.status(statusCode).json({ success: false, message });
};

// Place order
const placeOrder = async (req, res) => {
  try {
    // Input validation
    const { userId, items, amount, address } = req.body;
    if (!userId || !items || !amount || !address) {
      return handleErrorResponse(res, 400, "Missing required fields");
    }

    if (!Array.isArray(items) || items.length === 0) {
      return handleErrorResponse(res, 400, "Invalid items data");
    }

    // Create new order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: "pending" // Default status
    });

    await newOrder.save();
    
    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Prepare Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: item.name,
          metadata: { productId: item.id } // Add product ID for reference
        },
        unit_amount: Math.round(Number(item.price) * 100), // Ensure proper rounding
      },
      quantity: item.quantity,
    }));

    // Add delivery charge
    line_items.push({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: DELIVERY_CHARGE * 100,
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id.toString()
      }
    });

    return res.json({ 
      success: true, 
      session_url: session.url,
      orderId: newOrder._id
    });

  } catch (error) {
    return handleErrorResponse(res, 500, "Error processing order", error);
  }
};

// Verify order
const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    
    if (!orderId) {
      return handleErrorResponse(res, 400, "Order ID is required");
    }

    if (success === "true") {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId, 
        { payment: true, status: "paid" },
        { new: true }
      );
      
      if (!updatedOrder) {
        return handleErrorResponse(res, 404, "Order not found");
      }
      
      return res.json({ 
        success: true, 
        message: "Payment successful",
        order: updatedOrder
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ 
        success: false, 
        message: "Payment cancelled" 
      });
    }
  } catch (error) {
    return handleErrorResponse(res, 500, "Error verifying order", error);
  }
};

// User orders for frontend
const userOrders = async (req,res) => {

  try {
    const orders = await orderModel.find({userId:req.body.userId});
    res.json({success:true, data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
    
  }
  
}

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
      .sort({ createdAt: -1 }) // Newest first
      .populate('userId', 'name email'); // Add user info

    return res.json({ 
      success: true, 
      count: orders.length,
      data: orders 
    });
  } catch (error) {
    return handleErrorResponse(res, 500, "Error fetching orders list", error);
  }
};

// API for updating order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    if (!orderId || !status) {
      return handleErrorResponse(res, 400, "Order ID and status are required");
    }

    const validStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return handleErrorResponse(res, 400, "Invalid status value");
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return handleErrorResponse(res, 404, "Order not found");
    }

    return res.json({ 
      success: true, 
      message: "Status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    return handleErrorResponse(res, 500, "Error updating order status", error);
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };