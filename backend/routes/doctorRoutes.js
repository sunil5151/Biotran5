// Import the controller functions
import { 
  getPatientData, 
  checkPatientAccess 
} from '../controllers/doctorController.js';

// Add these routes to your existing doctorRoutes.js file
router.get('/patient/:patientEmail', authMiddleware, getPatientData);
router.get('/check-patient-access/:patientEmail', authMiddleware, checkPatientAccess);
