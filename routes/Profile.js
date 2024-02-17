const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middlewares/auth")
const profileController= require("../controllers/Profile")


router.delete("/deleteProfile", auth, profileController.deleteAccount)
router.put("/updateProfile", auth, profileController.updateProfile)
router.get("/getUserDetails", auth, profileController.getUserDetails)

// router.get("/getEnrolledCourses", auth, getEnrolledCourses)
// router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router