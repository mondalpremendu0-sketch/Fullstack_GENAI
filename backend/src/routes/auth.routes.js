const express = require('express');

const authController = require('../controllers/auth.controller.js');
const isLogedIn = require('../middleware/auth.middleware.js')


const router = express.Router();


router.post("/register",authController.register_controller)
router.post("/login",authController.login_controller)
router.get("/getMe",isLogedIn,authController.getMe_controller)
router.get("/logout",isLogedIn,authController.logout_controller)

module.exports = router;