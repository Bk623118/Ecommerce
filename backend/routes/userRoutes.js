const express = require('express');
const router = express.Router();
const  {registerUser,loginUser}  = require('../controller/userController');
const  ensureAuthenticated  = require('../middleware/authMiddleware');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

module.exports = router;