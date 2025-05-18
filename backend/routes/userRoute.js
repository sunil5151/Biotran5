
import express from 'express';
import multer from 'multer';
import { login,getUsers,signup , updateUser, updateAddress, getUserDocument,  sendOTP, verifyOTP, resendOTP,updateUserDocuments,getCurrentUser,assignDoctor, uploadPdf} from '../controllers/userController.js';
import upload from '../middlewares/multer.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import User from '../models/userModel.js';
import doctorModel from "../models/doctorModel.js";
const userRouter = express.Router();

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });
userRouter.post("/send-otp", sendOTP);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/resend-otp", resendOTP);
userRouter.post("/assign-doctor", verifyToken, assignDoctor);
userRouter.get('/me', verifyToken, getCurrentUser); 
userRouter.get('/getUsers', verifyToken, getUsers);
userRouter.post('/signup', upload.single('image'), signup);
userRouter.post('/login', login);userRouter.put('/upload-pdf', verifyToken, uploads.single('pdf'), uploadPdf);
userRouter.get('/get-users', verifyToken, getUsers);
userRouter.put('/update', verifyToken, upload.single('prescriptionImage'), updateUser);
userRouter.put('/update-address', verifyToken,updateAddress);
userRouter.get('/patients/assigned-to-me', verifyToken, async (req, res) => {
  try {
    const doctorName = req.user.name;
    if (!doctorName) {
      return res.status(400).json({ success: false, message: "Doctor name not found in token" });
    }

    // Find all users whose doctorAssigned.name matches the logged-in doctor's name
    const patients = await User.find({ "doctorAssigned.name": doctorName });

    // Prepare patient data with PDF info
    const patientData = patients.map(u => ({
      name: u.name,
      email: u.email,
      doctorAssigned: u.doctorAssigned,
      pdfAvailable: !!u.documents?.pdf,
      patientId: u._id
    }));

    return res.status(200).json({
      success: true,
      patients: patientData
    });
  } catch (error) {
    console.error("Error fetching assigned patients:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching assigned patients",
      error: error.message
    });
  }
});

// Endpoint to get a patient's PDF by ID
userRouter.get('/patient/:id/pdf', verifyToken, async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);
    if (!patient || !patient.documents?.pdf) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="patient.pdf"',
    });
    res.send(patient.documents.pdf);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching PDF", error: error.message });
  }
});
userRouter.put('/update-documents', verifyToken, 
    uploads.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'prescription', maxCount: 1 },
        { name: 'medicalReport', maxCount: 1 },
        { name: 'insurance', maxCount: 1 }
    ]),
    updateUserDocuments
);

userRouter.get('/document/:documentType', getUserDocument);
userRouter.post('/grant-doctor-access', verifyToken, async (req, res) => {
  try {
    const { doctorEmail } = req.body;
    const userEmail = req.user.email;

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the doctor
    const doctor = await doctorModel.findOne({ email: doctorEmail });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Initialize authorizedDoctors array if it doesn't exist
    if (!user.authorizedDoctors) {
      user.authorizedDoctors = [];
    }

    // Check if doctor is already authorized
    const isAlreadyAuthorized = user.authorizedDoctors.some(
      (doc) => doc.email === doctorEmail
    );

    if (isAlreadyAuthorized) {
      return res.status(400).json({
        success: false,
        message: 'This doctor already has access to your data',
      });
    }

    // Add doctor to authorized list
    user.authorizedDoctors.push({
      email: doctorEmail,
      name: doctor.name,
      grantedDate: new Date()
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Doctor access granted successfully',
    });
  } catch (error) {
    console.error('Error granting doctor access:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while granting doctor access',
      error: error.message
    });
  }
});

// Revoke access from a doctor
userRouter.post('/revoke-doctor-access',verifyToken,  async (req, res) => {
  try {
    const { doctorEmail } = req.body;
    const userEmail = req.user.email;

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove doctor from authorized list
    user.authorizedDoctors = user.authorizedDoctors.filter(
      (doc) => doc.email !== doctorEmail
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Doctor access revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking doctor access:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while revoking doctor access',
    });
  }
});

// Get all authorized doctors for a user
userRouter.get('/authorized-doctors',verifyToken,  async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      authorizedDoctors: user.authorizedDoctors,
    });
  } catch (error) {
    console.error('Error fetching authorized doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching authorized doctors',
    });
  }
});

export default userRouter;