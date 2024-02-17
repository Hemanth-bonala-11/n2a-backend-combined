
const express = require("express")
const router = express.Router()


const courseController = require("../controllers/Course")


const categoryController = require("../controllers/Category")


const sectionController = require("../controllers/Section")


const subsectionController = require("../controllers/subSection")


const ratingController = require("../controllers/ratingAndReview")

// const {
//   updateCourseProgress
// } = require("../controllers/courseProgress");


const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

router.post("/createCourse", auth, isInstructor, courseController.createCourse)
router.post("/addSection", auth, isInstructor, sectionController.createSection)
router.post("/updateSection", auth, isInstructor, sectionController.updateSection)
router.post("/deleteSection", auth, isInstructor, sectionController.deleteSection)

// router.post("/updateSubSection", auth, isInstructor, subsectionController.)
router.post("/deleteSubSection", auth, isInstructor, subsectionController.deleteSubSection)
router.post("/addSubSection", auth, isInstructor, subsectionController.createSubSection)

// router.get("/getAllCourses", getAllCourses)
router.post("/getCourseDetails", courseController.getCourseDetails)
// router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// router.post("/editCourse", auth, isInstructor, courseController.editCourse)

// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// router.delete("/deleteCourse", deleteCourse)
// router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


router.post("/createCategory", auth, isAdmin, categoryController.createCategory)
router.get("/showAllCategories", categoryController.showAllCategories)
router.post("/getCategoryPageDetails", categoryController.categoryPageDetails)

router.post("/createRating", auth, isStudent, ratingController.createRating)
router.get("/getAverageRating", ratingController.getAverageRating)
router.get("/getReviews", ratingController.getAllRatings)

module.exports = router