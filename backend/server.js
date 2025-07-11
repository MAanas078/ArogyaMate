import express from "express";
import cors from 'cors';
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import placesRouter from "./routes/places.js";  // Import the places route
import sendEmail from './utils/emailService.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/places", placesRouter);  // Add the places route

app.get('/test-email', async (req, res) => {
  const testEmail = process.env.EMAIL_USER;  // Correct way to access the environment variable
  const testTime = new Date(Date.now() + 24 * 60 * 60 * 1000);  // 24 hours from now

  try {
    await sendEmail(
      testEmail,  // Use the actual email from environment variable
      '⏰ Appointment Reminder (Test)',
      `This is a test reminder email for your appointment scheduled at ${testTime.toLocaleString()}.`
    );
    res.send('✅ Test email sent!');
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    res.status(500).send('❌ Failed to send test email');
  }
});

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));
