import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import placesRouter from "./routes/places.js";
import sendEmail from "./utils/emailService.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to DBs and services
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/places", placesRouter);

// Test email route
app.get("/test-email", async (req, res) => {
  const testEmail = process.env.EMAIL_USER;
  const testTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    await sendEmail(
      testEmail,
      "⏰ Appointment Reminder (Test)",
      `This is a test reminder email for your appointment scheduled at ${testTime.toLocaleString()}.`
    );
    res.send("✅ Test email sent!");
  } catch (error) {
    console.error("❌ Failed to send test email:", error);
    res.status(500).send("❌ Failed to send test email");
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ API is working");
});

// Start the server (Render requires listening on 0.0.0.0)
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server started on http://0.0.0.0:${port}`);
});
