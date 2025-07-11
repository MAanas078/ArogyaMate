import cron from "node-cron";
import appointmentModel from "../models/appointmentModel.js";
import sendEmail from "../utils/emailService.js";

const startReminderJob = () => {
  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("📧 Running email reminder job...");

    try {
      const now = new Date();

      // Target time: 24 hours from now
      const targetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // 15-minute buffer on both sides
      const bufferMillis = 15 * 60 * 1000;
      const startTimestamp = targetTime.getTime() - bufferMillis;
      const endTimestamp = targetTime.getTime() + bufferMillis;

      // Logging window
      const formatTime = (timestamp) =>
        new Date(timestamp).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          month: "short",
          day: "numeric",
          year: "numeric",
        });

      console.log(
        `🔍 Looking for appointments between: ${formatTime(startTimestamp)} and ${formatTime(endTimestamp)}`
      );

      // Fetch upcoming appointments that are neither cancelled nor completed
      const appointments = await appointmentModel.find({
        date: { $gte: startTimestamp, $lte: endTimestamp },
        cancelled: false,
        isCompleted: false,
      });

      console.log(`✅ Found ${appointments.length} appointment(s) to remind.`);

      for (const appointment of appointments) {
        const userEmail = appointment.userData?.email;
        const doctorName = appointment.docData?.name || "your doctor";

        const appointmentDate = new Date(appointment.date);
        const formattedDate = appointmentDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        const formattedTime = appointmentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        if (userEmail) {
          const subject = "⏰ Appointment Reminder";
          const message = `Hello ${appointment.userData?.name || ""},\n\nThis is a reminder that you have an appointment with Dr. ${doctorName} on ${formattedDate} at ${formattedTime}.\n\nThanks,\nDocOnGo Team`;

          await sendEmail(userEmail, subject, message);
          console.log(`📨 Reminder sent to ${userEmail}`);
        }
      }
    } catch (err) {
      console.error("❌ Error in email reminder job:", err.message);
    }
  });
};

export default startReminderJob;
