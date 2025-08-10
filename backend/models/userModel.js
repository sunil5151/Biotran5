import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Existing fields
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: {
    base64: {
      type: String,
      required: true,
      default:
        "iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA5uSURBVHgB7d0JchvHFcbxN+",
    },
    mimeType: { type: String, required: true, default: "image/png" },
  },
  documents: {
    photo: {
      url: String,
      public_id: String,
      contentType: String,
      fileName: String,
    },
    prescription: {
      url: String,
      public_id: String,
      contentType: String,
      fileName: String,
    },
    medicalReport: {
      url: String,
      public_id: String,
      contentType: String,
      fileName: String,
    },
    insurance: {
      url: String,
      public_id: String,
      contentType: String,
      fileName: String,
    },
  },
  gender: { type: String, default: "Not Selected" },
  dob: { type: String, default: "Not Selected" },
  phone: { type: String, default: "00000000000" },
  bloodGroup: { type: String, default: "Not Provided" },
  age: { type: Number, default: 0 },
  authorizedDoctors: [
    {
      email: String,
      name: String,
      grantedDate: Date,
    },
  ],
  emergencyContact: { type: String, default: "Not Provided" },
  allergies: { type: String, default: "None" },
  vaccinationHistory: { type: String, default: "None" },
  healthInsurancePolicy: { type: String, default: "None" },
  doctorAssigned: {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
  },
  prescriptionPdf: {
    data: Buffer,
    contentType: String,
  },

  // New address fields
  permanentAddress: { type: String, default: "Not Provided" },
  correspondenceAddress: { type: String, default: "Not Provided" },
  lane: { type: String, default: "Not Provided" },
  city: { type: String, default: "Not Provided" },
  state: { type: String, default: "Not Provided" },
  country: { type: String, default: "Not Provided" },
  postalCode: { type: String, default: "Not Provided" },
  landmark: { type: String, default: "Not Provided" },
  alternativeContact: { type: String, default: "Not Provided" },
  addressType: { type: String, default: "Not Selected" },
  additionalNotes: { type: String, default: "No additional notes" },
});

// Add pre-save middleware to initialize authorizedDoctors array
userSchema.pre("save", function (next) {
  if (!this.authorizedDoctors) {
    this.authorizedDoctors = [];
  }
  next();
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
