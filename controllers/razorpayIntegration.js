const { default: mongoose } = require('mongoose');
const {instance} = require('../config/razorpayConfig');
const Course = require('../models/Course');
const User = require('../models/User')
const mailSender = require('../utils/mailSender');
const courseEnrollemntMail = require('../mail/templates/courseEnrollment')


exports.capturePayment = async (req, res)=>{

    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Course id cannot be empty"
            })
        }
        const courseDetail = Course.findById(courseId);
        if(!courseDetail){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        const uid = new mongoose.Types.ObjectId(userId)
        if(courseDetail.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success: false,
                message: "Student is already enrolled in this course"
            })
        }
        const amount = courseDetail.price*100;
    const currency = "INR";
    const options = {
        amount: amount,
        currency: currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
           courseId,
           userId
        }
    }
    try {
        const paymentResponse = await instance.orders.create(
            options
        );
        console.log(paymentResponse);
        return res.status(200).json({
            success: true,
            courseName: courseDetail.courseName,
            description: courseDetail.description,
            thumbnail: courseDetail.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
    
}

exports.verifySignature = async (req, res)=>{
    try {
        const webhookSecret = process.env.RAZORPAY_SECRET_KEY;
        const signature = req.headers["x-razorpay-signature"];
        const shaSum = crypto.createHmac("sha256",webhookSecret);
        shaSum.update(JSON.stringify(req.body));
        const digest = shaSum.digest("hex");

        if(signature===digest){
            // payment authorized ==> enroll student in the course
            console.log("Payment is authorized");
            const { courseId, userId} = req.body.payload.payment.entity.notes;
            try {
                // find course and add userid to studentsenrolled and add course id to student users courses
                const enrolledCourse = await Course.findByIdAndUpdate(courseId,{
                    $push:{
                        studentsEnrolled: userId
                    }
                },{new: true});
                if(!enrolledCourse){
                    return res.status(400).json({
                        success: false,
                        message: "Course Not found"
                    })
                }
                console.log(enrolledCourse,"enrolled course");
                const student = await User.findByIdAndUpdate(userId,{
                    $push: {
                        courses: courseId
                    }
                }, {
                    new: true
                })

                console.log(student,"student");

                const emailResponse = await mailSender(student.email, "Course Enrollment successful", "Course Enrollment successful");
                return res.status(200).json({
                    success: true,
                    message: "successfully Student is enrolled in course"
                })

                

            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                })
                
            }

            
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Secret key is not matched"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}