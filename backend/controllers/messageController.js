import Message from '../models/messageModel.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content, hasAttachment, attachmentType, attachmentData, attachmentName } = req.body;
    
    if (!sender || !receiver || !content) {
      return res.status(400).json({
        success: false,
        message: 'Sender, receiver, and content are required'
      });
    }
    
    // Create new message
    const newMessage = new Message({
      sender,
      receiver,
      content,
      hasAttachment: hasAttachment || false,
      attachmentType: attachmentType || 'none',
      attachmentData: attachmentData || null,
      attachmentName: attachmentName || null
    });
    
    await newMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get chat history between two users
export const getChatHistory = async (req, res) => {
  try {
    const { sender, receiver } = req.query;
    
    if (!sender || !receiver) {
      return res.status(400).json({
        success: false,
        message: 'Sender and receiver are required'
      });
    }
    
    // Find messages between the two users
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ timestamp: 1 });
    
    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    
    if (!sender || !receiver) {
      return res.status(400).json({
        success: false,
        message: 'Sender and receiver are required'
      });
    }
    
    // Update all unread messages from sender to receiver
    await Message.updateMany(
      { sender, receiver, read: false },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};