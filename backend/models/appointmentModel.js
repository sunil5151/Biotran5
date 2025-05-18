
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    doctorEmail: {
      type: String,
      required: true
    },
    patientEmail: {
      type: String,
      required: true
    },
    appointmentDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  }, {
    timestamps: true
  });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
