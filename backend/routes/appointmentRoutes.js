import express from "express";
import stripe from "stripe";
import Razorpay from "razorpay";
import Appointment from "../models/appointmentModel.js";

const appointmentRouter = express.Router();

// Stripe and Razorpay setup
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

/**
 * @route   POST /api/appointments
 * @desc    Book an appointment via voice assistant or frontend
 * @access  Public
 */
appointmentRouter.post("/api/appointments", async (req, res) => {
  try {
    const { name, doctor, date, time } = req.body;

    if (!name || !doctor || !date || !time) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const userId = "voice-user";
    const docId = "voice-doc";
    const userData = { name };
    const docData = { name: doctor };

    const fullDateTime = new Date(`${date} ${new Date().getFullYear()} ${time}`);
    const timestamp = fullDateTime.getTime();

    const appointment = new Appointment({
      userId,
      docId,
      slotDate: date,
      slotTime: time,
      userData,
      docData,
      date: timestamp,
      amount: 10, // USD default amount
    });

    await appointment.save();

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    res.status(500).json({ error: "Booking failed" });
  }
});

/**
 * @route   POST /api/user/payment-stripe
 * @desc    Create Stripe Checkout session in USD
 * @access  Private
 */
appointmentRouter.post("/api/user/payment-stripe", async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || !appointment.amount) {
      return res.status(400).json({ success: false, message: "Invalid appointment or amount" });
    }

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Doctor Appointment",
              description: `With Dr. ${appointment.docData.name}`,
            },
            unit_amount: appointment.amount * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/my-appointments",
      cancel_url: "http://localhost:5173/my-appointments",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("❌ Stripe Error:", error);
    res.status(500).json({ success: false, message: "Stripe session failed" });
  }
});

/**
 * @route   POST /api/user/payment-razorpay
 * @desc    Create Razorpay order in USD (⚠️ requires international support)
 * @access  Private
 */
appointmentRouter.post("/api/user/payment-razorpay", async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || !appointment.amount) {
      return res.status(400).json({ success: false, message: "Invalid appointment or amount" });
    }

    const options = {
      amount: appointment.amount * 100, // smallest currency unit
      currency: "USD",
      receipt: `receipt_order_${appointmentId}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Razorpay Error:", error);
    res.status(500).json({ success: false, message: "Razorpay order failed" });
  }
});

export default appointmentRouter;


//sirf 2 baar clt + z