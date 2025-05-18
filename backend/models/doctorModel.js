import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: {
    base64: { type: String, required: true, default: "iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA5uSURBVHgB7d0JchvHFcbxN+" },
    mimeType: { type: String, required: true, default: "image/png" }
  },
  password: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  fees: { type: Number, required: true },
  address: { type: String, required: true },
  patients: [{
    email: { 
      type: String,
      required: true 
    },
    assignedDate: { 
      type: Date, 
      default: Date.now 
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  }],
  available: { type: Boolean, required: true },
  date: { type: Date, default: Date.now },
});

// Add pre-save middleware to initialize patients array
doctorSchema.pre('save', function(next) {
  if (!this.patients) {
    this.patients = [];
  }
  next();
});

// Create the model
const doctorModel = mongoose.model('Doctor', doctorSchema);

export default doctorModel;