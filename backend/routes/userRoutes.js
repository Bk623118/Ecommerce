const express = require('express');
const router = express.Router();
const  {registerUser,loginUser,logoutUser,requestPassowrdReset,resetPassword, getUserDetails, updatePassword, updateUserProfile, getUserList}  = require('../controller/userController');
const  {ensureAuthenticated,roleBasedAccess}  = require('../middleware/authMiddleware');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/password/forgot').post(requestPassowrdReset);
router.route('/password/reset/:token').post(resetPassword);
router.route('/Profile').post(ensureAuthenticated,getUserDetails);
router.route('/password/update').post(ensureAuthenticated,updatePassword);
router.route('/profile/update').post(ensureAuthenticated,updateUserProfile);
router.route('/admin/users').get(ensureAuthenticated,roleBasedAccess("admin"),getUserList);





module.exports = router;