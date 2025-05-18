import express from 'express';
import multer from 'multer';
import { signup, login, getCurrentDoctor, getAllDoctors, searchDoctor, getDoctorPatientEmails, getDoctorByEmail, sendOTP, verifyOTP, resendOTP } from '../controllers/doctorController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import appointmentModel from '../models/appointmentModel.js';


const doctorRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Move OTP routes to the top and fix their paths
doctorRouter.post('/send-otp', sendOTP);       // Remove /api prefix
doctorRouter.post('/verify-otp', verifyOTP);   // Remove /api prefix
doctorRouter.post('/resend-otp', resendOTP);   // Remove /api prefix


// Protected routes that need authentication
doctorRouter.get('/me', verifyToken, getCurrentDoctor); // Must come before /:email
doctorRouter.get('/patients/assigned', verifyToken, async (req, res) => {
  try {
    const doctorEmail = req.user.email;

    // Find all patients assigned to this doctor
    const assignedPatients = await userModel.find({
      'doctorAssigned.email': doctorEmail,
      isDoctor: { $ne: true } // Exclude other doctors
    }, 'name email documents.pdf');

    // Convert PDF buffers to base64 strings
    const patientsWithFormattedDocs = assignedPatients.map(patient => ({
      name: patient.name,
      email: patient.email,
      medicalRecord: patient.documents?.pdf 
        ? `data:application/pdf,base64,${patient.documents.pdf.toString('base64')}` 
        : null
    }));

    return res.status(200).json({
      success: true,
      patients: patientsWithFormattedDocs
    });

  } catch (error) {
    console.error('Error fetching assigned patients:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching assigned patients',
      error: error.message
    });
  }
});
doctorRouter.get('/patients/emails', verifyToken, getDoctorPatientEmails);

// Public routes
doctorRouter.get('/search', searchDoctor);
doctorRouter.get('/all', getAllDoctors);
doctorRouter.post('/signup', upload.single('image'), signup);
doctorRouter.post('/login', login);
doctorRouter.get('/doctor-appointments', verifyToken, async (req, res) => {
  try {
    const doctorEmail = req.user.email;
    const appointments = await appointmentModel.find({ doctorEmail });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching doctor's appointments" });
  }
});
// Dynamic routes (must come last)
doctorRouter.get('/:email', getDoctorByEmail);
doctorRouter.post('/assign', async (req, res) => {
  try {
    const { userEmail, doctorEmail } = req.body;
    console.log("Processing assignment request for:", { userEmail, doctorEmail });

    // Input validation
    if (!userEmail || !doctorEmail) {
      return res.status(400).json({
        success: false,
        message: "Both userEmail and doctorEmail are required."
      });
    }

    // Find user and doctor
    const user = await userModel.findOne({ email: userEmail });
    const doctor = await doctorModel.findOne({ email: doctorEmail });

    console.log("Found user:", user?.email);
    console.log("Found doctor:", doctor?.email);

    if (!user || !doctor) {
      return res.status(404).json({
        success: false,
        message: `${!user ? 'User' : 'Doctor'} not found`
      });
    }

    try {
      // First, remove the existing patient entry if any
      await doctorModel.findOneAndUpdate(
        { email: doctorEmail },
        { $pull: { patients: { email: userEmail } } }
      );

      // Then, add the new patient entry
      const updatedDoctor = await doctorModel.findOneAndUpdate(
        { email: doctorEmail },
        {
          $push: { 
            patients: {
              email: userEmail,
              assignedDate: new Date(),
              status: 'active'
            }
          }
        },
        { new: true, runValidators: true }
      );

      // Update user document
      const updatedUser = await userModel.findOneAndUpdate(
        { email: userEmail },
        {
          doctorAssigned: {
            name: doctor.name,
            email: doctor.email
          }
        },
        { new: true }
      );

      if (!updatedDoctor || !updatedUser) {
        throw new Error("Failed to update one or both documents");
      }

      return res.status(200).json({
        success: true,
        message: "Doctor assigned successfully",
        assignedDoctor: {
          name: doctor.name,
          email: doctor.email
        }
      });

    } catch (saveError) {
      console.error("Error saving documents:", saveError);
      return res.status(500).json({
        success: false,
        message: "Failed to save changes",
        error: saveError.message
      });
    }

  } catch (error) {
    console.error("Error in doctor assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign doctor",
      error: error.message
    });
  }
});

export default doctorRouter;