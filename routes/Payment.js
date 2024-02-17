const express = require("express")
const router = express.Router()

const paymentController = require("../controllers/razorpayIntegration")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudent, paymentController.capturePayment)
router.post("/verifyPayment",auth, isStudent, paymentController.verifySignature)
// router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router