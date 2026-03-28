const express = require('express');
const router = express.Router();
const { loginCustomerUser, loginAdminUser, registerUser, verifyUser, refreshAccessToken, logoutUser } = require('../controllers/authController');

router.post('/login', loginCustomerUser);
router.post('/admin-login', loginAdminUser);
router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

module.exports = router;
