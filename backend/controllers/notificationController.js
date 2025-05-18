import Notification from '../models/notificationModel.js';

// Create a notification
export const createNotification = async (doctorEmail, patientEmail, patientName, type) => {
  try {
    const notification = new Notification({
      doctorEmail,
      patientEmail,
      patientName,
      type
    });
    
    await notification.save();
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

// Get notifications for a doctor
export const getDoctorNotifications = async (req, res) => {
  try {
    const doctorEmail = req.user.email;
    
    const notifications = await Notification.find({ 
      doctorEmail 
    }).sort({ date: -1 }).limit(10);
    
    return res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching notifications'
    });
  }
};

// Mark a notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const doctorEmail = req.user.email;
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Ensure the notification belongs to the doctor
    if (notification.doctorEmail !== doctorEmail) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    notification.read = true;
    await notification.save();
    
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while marking notification as read'
    });
  }
};