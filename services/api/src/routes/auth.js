const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username and password are required'
    });
  }

  // Validate against environment variables
  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (!validUsername || !validPassword) {
    console.error('AUTH_USERNAME or AUTH_PASSWORD not configured');
    return res.status(500).json({
      success: false,
      error: 'Server authentication not configured'
    });
  }

  if (username === validUsername && password === validPassword) {
    // Generate a simple session token using API key + timestamp
    const timestamp = Date.now().toString();
    const apiKey = process.env.API_KEY || 'default-key';
    const token = crypto
      .createHash('sha256')
      .update(`${apiKey}-${timestamp}`)
      .digest('hex');

    return res.json({
      success: true,
      data: {
        username,
        token
      },
      message: 'Login successful'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid username or password'
  });
});

module.exports = router;
