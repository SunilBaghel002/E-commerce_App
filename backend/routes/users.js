// User Routes (for customer self-service)
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// All user-related routes are handled in auth.js
// This file is for any additional user endpoints

module.exports = router;
