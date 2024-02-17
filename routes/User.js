// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const authController= require("../controllers/Auth")
const reset = require("../controllers/ResetPassword")

const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// Route for user login
router.post("/login", authController.login)


router.post("/signup", authController.signup)


router.post("/sendotp", authController.sendOTP)
router.post("/changepassword", auth, authController.changePassword)
router.post("/reset-password-token", reset.resetPasswordToken)


router.post("/reset-password", reset.resetPassword)


module.exports = router