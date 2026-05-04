const express = require('express');
const authController = require('../controllers/auth.controller.js');
const router = express.Router();



router.post("/register",authController.register_controller)
router.post("/login",authController.login_controller)


module.exports = router;