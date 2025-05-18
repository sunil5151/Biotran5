// routes/appointmentRoute.js
import express from 'express';
import Appointment from '../models/appointmentModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import nodemailer from 'nodemailer'; // You'll need to install this package

const appointmentRouter = express.Router();

// Create a transporter for sending emails
// You'll need to configure this with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: process.env.EMAIL_USER, // set these in your .env file
    pass: process.env.EMAIL_PASSWORD
  }
});

// Check if a doctor is free on a given date (simple date check)
appointmentRouter.get('/check', async (req, res) => {
    try {
        console.log("Received check request:", req.query);
        const { doctorEmail, appointmentDate } = req.query;
    
        if (!doctorEmail || !appointmentDate) {
          return res.status(400).json({
            success: false,
            message: "Doctor email and appointment date are required"
          });
        }
    
        // Check if the time slot is available
        const date = new Date(appointmentDate);
        const existingAppointment = await Appointment.findOne({
            doctorEmail,
            appointmentDate: {
                $gte: new Date(date.setHours(0,0,0,0)),
                $lte: new Date(date.setHours(23,59,59,999))
            }
        });
    
        const isAvailable = !existingAppointment;
        console.log("Availability result:", isAvailable);
    
        return res.json({
          success: true,
          message: isAvailable 
            ? "This slot is available!" 
            : "This slot is not available.",
          isAvailable
        });
    
      } catch (error) {
        console.error("Server error during availability check:", error);
        return res.status(500).json({
          success: false,
          message: "Error checking appointment availability"
        });
      }
    });

// Book an appointment (requires authentication)
appointmentRouter.get('/my-appointments', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email;
        
        const appointments = await Appointment.find({ 
            patientEmail: userEmail 
        }).sort({ appointmentDate: -1 }); // Sort by date descending

        console.log("Fetched appointments:", appointments);

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch appointments"
        });
    }
});

appointmentRouter.post('/book', verifyToken, async (req, res) => {
    try {
        const { doctorEmail, appointmentDate } = req.body;
        const patientEmail = req.user.email;

        console.log("Booking attempt:", { doctorEmail, appointmentDate, patientEmail });

        if (!doctorEmail || !appointmentDate || !patientEmail) {
            return res.status(400).json({ 
                success: false, 
                message: "Required fields missing." 
            });
        }

        const date = new Date(appointmentDate);
        
        // Check again if slot is available
        const existingAppointment = await Appointment.findOne({
            doctorEmail,
            appointmentDate: {
                $gte: new Date(date.setHours(0,0,0,0)),
                $lte: new Date(date.setHours(23,59,59,999))
            }
        });

        if (existingAppointment) {
            return res.status(409).json({ 
                success: false, 
                message: "This slot is no longer available." 
            });
        }

        // Create and save the appointment
        const appointment = new Appointment({
            doctorEmail,
            patientEmail,
            appointmentDate: date,
            status: 'pending'
        });

        await appointment.save();
        console.log("Appointment booked:", appointment);

        res.json({ 
            success: true, 
            message: "Appointment booked successfully!", 
            appointment 
        });

    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to book appointment." 
        });
    }
});

// New endpoint for sending confirmation email
appointmentRouter.post('/send-confirmation', verifyToken, async (req, res) => {
    try {
        const { doctorEmail, appointmentDate, patientEmail } = req.body;
        
        // Validate input
        if (!doctorEmail || !appointmentDate || !patientEmail) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }
        
        // Format the date for display
        const formattedDate = new Date(appointmentDate).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Get doctor details if needed
        // const doctor = await Doctor.findOne({ email: doctorEmail });
        
        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: patientEmail,
            subject: 'Appointment Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4a6cf7; text-align: center;">Appointment Confirmation</h2>
                    <p>Dear Patient,</p>
                    <p>Your appointment has been successfully booked!</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Doctor:</strong> ${doctorEmail}</p>
                        <p><strong>Date & Time:</strong> ${formattedDate}</p>
                    </div>
                    <p>Please arrive 15 minutes before your scheduled appointment time.</p>
                    <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
                    <p style="text-align: center; margin-top: 30px; color: #777;">Thank you for choosing our services!</p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({
            success: true,
            message: "Confirmation email sent successfully"
        });
        
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send confirmation email"
        });
    }
});

export default appointmentRouter;