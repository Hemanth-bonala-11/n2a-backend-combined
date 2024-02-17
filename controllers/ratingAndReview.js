const Rating = require('../models/Rating');
const Course = require('../models/Course');
const mongoose = require('mongoose')

exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const {rating, review, courseId} = req.body;
        const courseDetails = await Course.findOne({_id:courseId,
            studentsEnrolled : {$elemMatch: {$eq: userId}}
        });
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        const alreadyReviewed = await Rating.findOne({
            user: userId,
            course: courseId
        })
        if(alreadyReviewed){
            return res.status(400).json({
                success: false,
                message: "Course is already reviewed by this user"
            })
        }
        const ratingReview = await Rating.create({
            rating, review, course:courseId,
            user: userId
        });
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {
                $push: {
                    ratingsAndReviews: ratingReview._id
                }
            }, {new: true})
        return res.status(200).json({
            success: true,
            message: "Created review successfully",
            data: updatedCourse
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAverageRating = async (req, res)=>{
    try {
        const {courseId} = req.body;

        const result = await Rating.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },{
                $group: {
                    _id: null,
                    averageRating: { $avg: "rating"}
                }
            }
        ])
        if (result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        }
        return res.status(200).json({
            success: false,
            averageRating: 0,
            message: "No reviews found"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        }) 
    }
}

exports.getAllRatings = async (req, res)=>{
    try {
        const ratings = await Rating.find({})
                                .sort({rating: "desc"})
                                .populate({
                                    path: "user",
                                    select: "firstName lastName email profilePicture"
                                })
                                .populate({
                                    path: "course",
                                    select: "courseName"
                                })
                                .exec();
        return res.status(200).json({
            success: true,
            data: ratings
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        }) 
    }
}