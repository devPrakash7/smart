const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const { user_validator, login_validator, validation_result
 } = require('../../validation/user.validator')

const {
  signUp,
  login,
  logout,
  studentRegistration,
  reSet_password,
} = require('../controllers/user.controller')


router.post('/signUp',  signUp)
router.post('/login', login)
router.get('/logout', authenticate, logout)
router.post('/registrationNewStudent',  studentRegistration),
router.post('/reSet_password' , authenticate , reSet_password)




module.exports = router;
