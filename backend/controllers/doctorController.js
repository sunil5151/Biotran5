import jwt from 'jsonwebtoken';
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
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
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }
    const base64Image = imageFile.buffer.toString('base64');
    const mimeType = imageFile.mimetype;

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

