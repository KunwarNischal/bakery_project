const express = require('express');
const router = express.Router();
const { authUser, registerUser, verifyUser } = require('../controllers/authController');

router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/verify', verifyUser);

module.exports = router;
