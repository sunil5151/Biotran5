
import jwt from 'jsonwebtoken';
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import OTPSchema from '../models/otpModel.js';  // Remove duplicate import


export const getAllDoctors = async (req, res) => {
  try {
    // Fetch only name, email, and password fields for all doctors
    const doctors = await doctorModel.find({}, 'name email password patients image');

    // console.log("Doctors fetched successfully:", doctors);

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      doctors
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


export const getDoctorPatientEmails = async (req, res) => {
  try {
    const doctorEmail = req.user.email;
    
    // Find all users who have authorized this doctor
    const authorizedPatients = await userModel.find({
      'authorizedDoctors.email': doctorEmail
    }, 'name email');

    return res.status(200).json({
      success: true,
      patients: authorizedPatients.map(patient => ({
        name: patient.name,
        email: patient.email
      }))
    });

  } catch (error) {
    console.error("Error fetching authorized patients:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching authorized patients",
      error: error.message
    });
  }
};
export const searchDoctor = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Doctor name is required"
      });
    }

    // Case-insensitive search for doctor name
    const doctor = await doctorModel.findOne({
      name: { $regex: new RegExp(name, 'i') }
    }).populate('patients', 'name email phone age bloodGroup');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.json({
      success: true,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        speciality: doctor.speciality,
        patients: doctor.patients || [],
        degree: doctor.degree,
        experience: doctor.experience
      }
    });
  } catch (error) {
    console.error("Error searching doctor:", error);
    res.status(500).json({
      success: false,
      message: "Error searching doctor",
      error: error.message
    });
  }
};

export const getCurrentDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id; // Assuming doctor is authenticated and req.user contains doctor info

    const doctor = await doctorModel.findById(doctorId).populate("patients", "name email age phone");

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ 
      success: true, 
      doctor: {
        name: doctor.name,
        email: doctor.email,
        speciality: doctor.speciality,
        degree: doctor.degree,
        experience: doctor.experience,
        about: doctor.about,
        fees: doctor.fees,
        address: doctor.address,
        available: doctor.available,
        image: doctor.image, // <-- include image!
        patients: doctor.patients
      } 
    });
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const doctor = await doctorModel.findOne({ email });
      if (!doctor) {
        return res.status(401).json({
          success: false,
          message: "Doctor not found"
        });
      }
  
      // Simple password check (for demonstration purposes only; consider hashing for production)
      if (doctor.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid password"
        });
      }
  
      // Generate JWT token (expires in 1 hour for login)
      const token = jwt.sign(
        {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          speciality: doctor.speciality
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({
        success: true,
        message: "Login successful",
        token,
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          speciality: doctor.speciality,
          degree: doctor.degree,
          experience: doctor.experience,
          about: doctor.about,
          fees: doctor.fees,
          address: doctor.address,
          available: doctor.available,
          image: doctor.image
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  };
  export const getDoctorByEmail = async (req, res) => {
    try {
      // Decode if necessary (if using encoded URLs)
      const email = req.params.email;
      const doctor = await doctorModel.findOne({ email });
      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
      res.json({ success: true, doctor });
    } catch (error) {
      console.error("Error fetching doctor by email:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

export const signup = async (req, res) => {
  try {
    // Destructure required fields and additional doctor-specific fields from req.body
    const {
      name,
      email,
      password,
      otp,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available
    } = req.body;
    const imageFile = req.file;

    // Ensure mandatory fields for signup are provided
    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }
    const base64Image = imageFile.buffer.toString('base64');
    const mimeType = imageFile.mimetype;


    // Verify OTP first
const otpRecord = await OTPSchema.findOne({ email }).sort({ createdAt: -1 });
if (!otpRecord || otpRecord.otp !== otp) {
  return res.status(400).json({ 
    success: false, 
    message: 'Invalid OTP' 
  });
}
// Check if OTP is expired
if (new Date() - otpRecord.createdAt > 10 * 60 * 1000) {
  return res.status(400).json({ 
    success: false, 
    message: 'OTP expired' 
  });
}

    // Build doctor data with default values for missing fields (using non-empty defaults)
    const doctorData = {
      name,
      email,
      password,
      speciality: speciality || "General",
      degree: degree || "N/A",
      experience: experience || "N/A",
      about: about || "N/A",
      fees: fees ? Number(fees) : 0,
      address: address || "N/A",
      // Since no image is expected, we assign empty strings
      image: {
        base64: base64Image,
        mimeType: mimeType,
      },
      // Default value for available if not provided
      available: available !== undefined ? available : false
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();


    await OTPSchema.deleteMany({ email });


    // Generate JWT token (expires in 7 days for signup)
    const token = jwt.sign(
      {
        id: newDoctor._id,
        name: newDoctor.name,
        email: newDoctor.email,
        speciality: newDoctor.speciality
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, message: "Signup successful", token });
  } catch (error) {
    console.error("Doctor signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during signup"
    });
  }
};


// Update the transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});



// Test the connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP configuration error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});


// Update sendOTP function to specify doctor role


export const sendOTP = async (req, res) => {
  try {
    console.log('1. Starting Doctor OTP send process');
    const { email, name } = req.body;
    
    // Validate email and name
    if (!email || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and name are required' 
      });
    }

    // Check if doctor already exists
    const doctorExists = await doctorModel.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Doctor already exists with this email' 
      });
    }

    // Add database check
    console.log('MongoDB URL:', process.env.MONGODB);

    // Check for existing OTP and rate limit
    const existingOTP = await OTPSchema.findOne({ email }).sort({ createdAt: -1 });
    console.log('4. Existing OTP check:', existingOTP ? 'Found' : 'Not found');
    
    if (existingOTP && (new Date() - existingOTP.createdAt) < 60000) {
      console.log('5. Rate limit hit. Time since last OTP:', (new Date() - existingOTP.createdAt), 'ms');
      return res.status(429).json({ 
        success: false, 
        message: 'Please wait 1 minute before requesting another OTP' 
      });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true
    });
    console.log('7. Generated OTP:', otp);

    // Delete existing OTPs
    await OTPSchema.deleteMany({ email });
    console.log('8. Deleted existing OTPs');

    // Save new OTP
    try {
      await OTPSchema.create({ 
        email, 
        otp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 600000)
      });
    } catch (dbError) {
      if (dbError.code === 13297) {
        console.error('Database case sensitivity error:', dbError);
        res.status(500).json({
          success: false,
          message: 'Database configuration error',
          error: 'Please contact administrator'
        });
        return;
      }
      throw dbError;
    }

    // Email configuration check
    console.log('10. Email Configuration:', {
      from: process.env.EMAIL_USER,
      auth: process.env.EMAIL_PASS ? 'Password set' : 'Password missing'
    });

    // Send email
    try {
      console.log('11. Attempting to send email...');
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Doctor Account Verification',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <h2>Hello Dr. ${name},</h2>
            <p>Your OTP for doctor account verification is:</p>
            <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
            <p>This OTP is valid for 10 minutes only.</p>
            <p style="color: #f44336;">Please do not share this OTP with anyone.</p>
          </div>`
      });
      console.log('12. Email sent successfully:', info.messageId);
    } catch (emailError) {
      console.error('Email send error details:', {
        error: emailError.message,
        code: emailError.code,
        command: emailError.command,
        responseCode: emailError.responseCode,
        response: emailError.response
      });
      throw emailError;
    }

    console.log('13. Process completed successfully');
    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      validFor: '10 minutes'
    });

  } catch (error) {
    console.error('14. Process failed with error:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    // Find the latest OTP for this email
    const otpRecord = await OTPSchema.findOne({ email }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ 
        success: false, 
        message: 'No OTP found for this email. Please request a new OTP' 
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTPSchema.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new one' 
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }

    // Delete the used OTP
    await OTPSchema.deleteOne({ _id: otpRecord._id });

    res.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Delete any existing OTP for this email
    await OTPSchema.deleteMany({ email });

    // Generate new OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });

    // Save new OTP
    await OTPSchema.create({ email, otp });

    // Send email
    const mailOptions = {
      from: 'sunil.22210652@viit.ac.in',
      to: email,
      subject: 'Your New OTP for Account Verification',
      html: `<div>
        <h3>Hello,</h3>
        <p>Your new OTP for account verification is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
      </div>`
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
};






// Add these functions to your existing doctorController.js file

// Get patient data with access check
export const getPatientData = async (req, res) => {
  try {
    const doctorEmail = req.user.email;
    const { patientEmail } = req.params;

    // Find the patient
    const patient = await User.findOne({ email: patientEmail });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Check if doctor is authorized to access this patient's data
    const isAuthorized = patient.authorizedDoctors.some(
      (doc) => doc.email === doctorEmail
    );

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this patient\'s data',
        hasAccess: false
      });
    }

    // Return patient data
    return res.status(200).json({
      success: true,
      hasAccess: true,
      patient: {
        name: patient.name,
        email: patient.email,
        image: patient.image,
        documents: patient.documents,
        gender: patient.gender,
        dob: patient.dob,
        phone: patient.phone,
        bloodGroup: patient.bloodGroup,
        age: patient.age,
        emergencyContact: patient.emergencyContact,
        allergies: patient.allergies,
        vaccinationHistory: patient.vaccinationHistory,
        healthInsurancePolicy: patient.healthInsurancePolicy,
        // Address fields
        permanentAddress: patient.permanentAddress,
        correspondenceAddress: patient.correspondenceAddress,
        city: patient.city,
        state: patient.state,
        country: patient.country,
        postalCode: patient.postalCode
      }
    });
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching patient data',
    });
  }
};

// Check if doctor has access to a patient
export const checkPatientAccess = async (req, res) => {
  try {
    const doctorEmail = req.user.email;
    const { patientEmail } = req.params;

    // Find the patient
    const patient = await User.findOne({ email: patientEmail });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Check if doctor is authorized to access this patient's data
    const isAuthorized = patient.authorizedDoctors.some(
      (doc) => doc.email === doctorEmail
    );

    return res.status(200).json({
      success: true,
      hasAccess: isAuthorized
    });
  } catch (error) {
    console.error('Error checking patient access:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking patient access',
    });
  }
};