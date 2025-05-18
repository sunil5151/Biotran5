import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  doctorEmail: { type: String, required: true },
  patientEmail: { type: String, required: true },
  patientName: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['grant', 'revoke'],
    required: true 
  },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const notificationModel = mongoose.model('Notification', notificationSchema);

export default notificationModel;