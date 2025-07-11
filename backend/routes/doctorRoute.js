import express from 'express';
import {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
} from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
import Doctor from '../models/doctorModel.js'; // ✅ Import Doctor model

const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.get("/list", doctorList);
doctorRouter.post("/change-availability", authDoctor, changeAvailablity);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

// ✅ New route: Get doctors by language preference
doctorRouter.get("/by-language", async (req, res) => {
  const { language } = req.query;

  if (!language) {
    return res.status(400).json({ message: "Language parameter is required" });
  }

  try {
    const doctors = await Doctor.find({ languages: { $in: [language] } });
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors by language:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

export default doctorRouter;
