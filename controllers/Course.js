const Course = require('../models/Course');
const Category = require('../models/Category')
const User = require('../models/User');
const { uploadFileToCloudinary } = require('../utils/imageUploader');
require('dotenv').config()


// create course
exports.createCourse = async (req, res)=>{
    try {
        const {courseName, courseDescription, whatYouWillLearn, price, category} = req.body;

        const thumbnail = req.files.thumbnail;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory"
            })
        }
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor details not found"
            })
        }

        // const categoryDetails = await Category.findOne({name: category});
        const categoryDetails = await Category.findById(category)
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        const thumbnailImage = await uploadFileToCloudinary(thumbnail, process.env.THUMBNAIL_FOLDER);
        console.log(userId,"userid");
        console.log(instructorDetails._id, "instructor id")
        // check instructordetails._id and userid are same, if same remove calling instructordetails
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            category: category,
            thumbnail: thumbnailImage.secure_url
        })

        // update course in instuctor's courses
        await User.findByIdAndUpdate({_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id
                }
            },
            {new: true})

        // update category courses 

        await Category.findByIdAndUpdate({_id:category},{
            $push:{
                course: newCourse._id
            }
        },
        {new: true});


        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        })

        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })   
    }
}

exports.showAllCourses = async (req, res)=>{
    try {
        const allCourses = await Course.find({},{
            courseName:true,
            price: true,
            thumbnail: true,
            instructor: true,
            retingsAndReviews: true,
            studentsEnrolled: true
        }).populate("instructor").exec()

        // const allCourses = await Course.find({})
        return res.status(200).json({
            success: true,
            data: allCourses,
            message: "successfully fetched all courses"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })  
    }
}

exports.getCourseDetails = async (req, res)=>{
    try {
        const {courseId} = req.body;
        const courseDetails = await Course.findById(courseId).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails"
            }
        }).populate("category").populate("ratingsAndReviews").populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "Could not find the course"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })  
    }
}