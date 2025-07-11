import express from "express";
import Appointment from "../models/appointmentModel.js";

const appointmentRouter = express.Router();

/**
 * @route   POST /api/appointments
 * @desc    Book an appointment via voice assistant or frontend form
 * @access  Public
 */
appointmentRouter.post("/api/appointments", async (req, res) => {
  try {
    const { name, doctor, date, time } = req.body;

    console.log("📥 Incoming voice appointment booking:", req.body);

    // Basic validation
    if (!name || !doctor || !date || !time) {
      return res.status(400).json({ error: "All fields (name, doctor, date, time) are required." });
    }

    // Dummy user and doctor data for voice assistant
    const userId = "voice-user";
    const docId = "voice-doc";
    const userData = { name };
    const docData = { name: doctor };

    // Convert to timestamp for appointment date
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
    });

    await appointment.save();

    console.log("✅ Appointment saved successfully:", appointment);
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    res.status(500).json({ error: "Something went wrong while booking the appointment." });
  }
});

export default appointmentRouter;
