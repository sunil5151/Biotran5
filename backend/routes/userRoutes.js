// Add these new routes to your existing userRoutes.js file

// Grant access to a doctor
router.post('/grant-doctor-access', authMiddleware, async (req, res) => {
  try {
    const { doctorEmail } = req.body;
    const userEmail = req.user.email;

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the doctor
    const doctor = await Doctor.findOne({ email: doctorEmail });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check if doctor is already authorized
    const isAlreadyAuthorized = user.authorizedDoctors.some(
      (doc) => doc.email === doctorEmail
    );

    if (isAlreadyAuthorized) {
      return res.status(400).json({
        success: false,
        message: 'This doctor already has access to your data',
      });
    }

    // Add doctor to authorized list
    user.authorizedDoctors.push({
      email: doctorEmail,
      name: doctor.name,
      grantedDate: new Date()
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Doctor access granted successfully',
    });
  } catch (error) {
    console.error('Error granting doctor access:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while granting doctor access',
    });
  }
});

// Revoke access from a doctor
router.post('/revoke-doctor-access', authMiddleware, async (req, res) => {
  try {
    const { doctorEmail } = req.body;
    const userEmail = req.user.email;

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove doctor from authorized list
    user.authorizedDoctors = user.authorizedDoctors.filter(
      (doc) => doc.email !== doctorEmail
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Doctor access revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking doctor access:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while revoking doctor access',
    });
  }
});

// Get all authorized doctors for a user
router.get('/authorized-doctors', authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Find the user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      authorizedDoctors: user.authorizedDoctors,
    });
  } catch (error) {
    console.error('Error fetching authorized doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching authorized doctors',
    });
  }
});