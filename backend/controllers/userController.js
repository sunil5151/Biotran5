import userModel from '../models/userModel.js';
import validator from 'validator';
import upload from '../middlewares/multer.js';
import jwt from 'jsonwebtoken';
import doctorModel from '../models/doctorModel.js';
import User from '../models/userModel.js';

export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }
    
    // Get the binary data from the file
    const pdfBuffer = req.file.buffer;
    
    // Update the current user's document using the documents.pdf field
    await User.findByIdAndUpdate(req.user.id, {
      "documents.pdf": pdfBuffer,
      // Optionally, if you want to save the MIME type as well:
      "documents.pdfContentType": req.file.mimetype,
    });

    console.log('PDF stored in MongoDB successfully!');
    return res.status(200).json({ message: 'PDF stored in MongoDB successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Convert image to base64
    const base64Image = imageFile.buffer.toString('base64');
    const mimeType = imageFile.mimetype;

    const userData = {
      name,
      email,
      password,
      image: {
        base64: base64Image,
        mimeType: mimeType,
      }
    };

    const newUser = new userModel(userData);
    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return the token along with success message
    res.json({ success: true, message: 'Signup successful', token });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during signup"
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, ...updatedData } = req.body;

    console.log("Request body:", req.body);
    if (req.file) {
      console.log("File details:", req.file);
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          message: "Images Only!"
        });
      }
      updatedData.prescriptionPdf = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      console.log("Current logged-in user details:", { email });
      console.log("Data trying to match with:", updatedData);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { email, ...addressData } = req.body;

    // Validate required fields
    const requiredFields = ['permanentAddress', 'city', 'country', 'postalCode', 'contactNumber'];
    const missingFields = requiredFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        $set: {
          permanentAddress: addressData.permanentAddress,
          correspondenceAddress: addressData.correspondenceAddress,
          lane: addressData.lane,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          postalCode: addressData.postalCode,
          landmark: addressData.landmark,
          contactNumber: addressData.contactNumber,
          alternativeContact: addressData.alternativeContact,
          emergencyContact: addressData.emergencyContact,
          addressType: addressData.addressType,
          additionalNotes: addressData.additionalNotes
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Address updated successfully",
      address: {
        permanentAddress: updatedUser.permanentAddress,
        city: updatedUser.city,
        country: updatedUser.country
        // ... other address fields as needed
      }
    });

  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error.message
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Find user by id from token
    const user = await userModel.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Handle PDF data if exists
    let pdfBase64 = null;
    if (user.documents && user.documents.pdf) {
      const pdfField = user.documents.pdf;
      const pdfBuffer = Buffer.isBuffer(pdfField)
        ? pdfField
        : Buffer.from(pdfField.data || pdfField);
      pdfBase64 = pdfBuffer.toString('base64');
    }

    // Send single response with all user data
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        gender: user.gender,
        dob: user.dob,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        age: user.age,
        emergencyContact: user.emergencyContact,
        allergies: user.allergies,
        vaccinationHistory: user.vaccinationHistory,
        healthInsurancePolicy: user.healthInsurancePolicy,
        doctorAssigned: user.doctorAssigned,
        permanentAddress: user.permanentAddress,
        city: user.city,
        state: user.state,
        documents: {
          pdf: pdfBase64
        },
        country: user.country
      }
    });

  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const assignDoctor = async (req, res) => {
  try {
    // We receive the patient's email and the doctor's email
    const { patientEmail, doctorEmail } = req.body;

    // 1. Find the patient by email
    const patient = await userModel.findOne({ email: patientEmail });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // 2. Find the doctor by email
    const doctor = await doctorModel.findOne({ email: doctorEmail });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // 3. Update patient's document to store the doctor's email
    patient.doctorAssigned = doctorEmail;
    await patient.save();

    // 4. Add the patient's email to the doctor's "patients" array (if not already present)
    if (!doctor.patients.includes(patientEmail)) {
      doctor.patients.push(patientEmail);
      await doctor.save();
    }

    return res.json({
      success: true,
      message: "Doctor assigned successfully",
      updatedPatient: patient
    });
  } catch (error) {
    console.error("Error assigning doctor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const updateUserDocuments = async (req, res) => {
  try {
      const { email } = req.body;
      if (!email) {
          return res.status(400).json({
              success: false,
              message: 'Email is required'
          });
      }

      const files = req.files;
      if (!files || Object.keys(files).length === 0) {
          return res.status(400).json({
              success: false,
              message: 'No files were uploaded'
          });
      }

      const documentUpdates = {};

      // Process each file
      for (const [key, file] of Object.entries(files)) {
          if (file && file[0]) {
              documentUpdates[`documents.${key}`] = {
                  data: file[0].buffer,
                  contentType: file[0].mimetype,
                  fileName: file[0].originalname
              };
          }
      }

      const updatedUser = await userModel.findOneAndUpdate(
          { email },
          { $set: documentUpdates },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({
              success: false,
              message: 'User not found'
          });
      }

      res.status(200).json({
          success: true,
          message: 'Documents updated successfully'
      });

  } catch (error) {
      console.error('Error in updateUserDocuments:', error);
      res.status(500).json({
          success: false,
          message: 'Error updating documents',
          error: error.message
      });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.json({ 
      success: true, 
      users: users || [] 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

// Assign a doctor to a patient
export const assignDoctorToPatient = async (req, res) => {
  try {
    const { userId, doctorId } = req.body;

    // Ensure doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Update the patient’s assigned doctor
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { doctorAssigned: doctorId },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Add patient to the doctor's list if not already present
    if (!doctor.patients.includes(userId)) {
      doctor.patients.push(userId);
      await doctor.save();
    }

    res.json({ success: true, message: "Doctor assigned successfully", user: updatedUser });
  } catch (error) {
    console.error("Error assigning doctor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

// Generate JWT token
const token = jwt.sign(
  {
    id: user._id,
    name: user.name,
    email: user.email
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Return token, user details, and success message
res.json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image
  }
});;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getUserDocument = async (req, res) => {
  try {
      const userId = req.user.id;
      const { documentType } = req.params;

      const user = await User.findById(userId);
      if (!user || !user.documents[documentType]) {
          return res.status(404).json({
              success: false,
              message: 'Document not found'
          });
      }

      const document = user.documents[documentType];
      res.set('Content-Type', document.contentType);
      res.send(document.data);

  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Error retrieving document',
          error: error.message
      });
  }
};

export { signup, login , getUsers, updateUser,updateAddress,getCurrentUser};

// Add these functions to your existing userController.js file

// Import the notification controller
import { createNotification } from './notificationController.js';

// Update the grantDoctorAccess function
export const grantDoctorAccess = async (req, res) => {
  try {
    const { doctorEmail } = req.body;
    const userEmail = req.user.email;

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the doctor
    const doctor = await Doctor.findOne({ email: doctorEmail });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
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
    
    // Create a notification for the doctor
    await createNotification(doctorEmail, userEmail, user.name, 'grant');

    return res.status(200).json({
      success: true,
      message: 'Doctor access granted successfully',
    });
  } catch (error) {
    console.error('Error granting doctor access:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while granting doctor access',
    });
  }
};

// Update the revokeDoctorAccess function
export const revokeDoctorAccess = async (req, res) => {
  try {
    const { doctorEmail } = req.body;
    const userEmail = req.user.email;

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if doctor was authorized
    const wasAuthorized = user.authorizedDoctors.some(
      (doc) => doc.email === doctorEmail
    );

    // Remove doctor from authorized list
    user.authorizedDoctors = user.authorizedDoctors.filter(
      (doc) => doc.email !== doctorEmail
    );

    await user.save();
    
    // Create a notification for the doctor if they were previously authorized
    if (wasAuthorized) {
      await createNotification(doctorEmail, userEmail, user.name, 'revoke');
    }

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
};

// Get all authorized doctors for a user
export const getAuthorizedDoctors = async (req, res) => {
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
};