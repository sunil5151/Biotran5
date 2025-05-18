import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  // Add file attachment fields
  hasAttachment: {
    type: Boolean,
    default: false
  },
  attachmentType: {
    type: String,
    enum: ['pdf', 'none'],
    default: 'none'
  },
  attachmentData: {
    type: String, // Will store base64 data
    default: null
  },
  attachmentName: {
    type: String,
    default: null
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;