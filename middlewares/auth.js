const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User')

// auth
exports.auth = async (req, res, next)=>{
    try {
        const token = req.cookies.access_token || req.body.access_token || req.header('Authorisation').replace("Bearer", "");
        if(!token){
            return res.status(401).json({
                success: false,
                message: "anonymous user"
            })

        }
        try {
            const decoded = await jwt.verify(token, process.env.SECRET_KEY);
            console.log(decoded);
            req.user = decoded
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            })
            
        }
        next()
        

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//isStudent
exports.isStudent = async (req, res, next)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success: false,
                message: "Unauthorised this is route for student"
            })
        }
        next()
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(400).json({
                success: false,
                message: "Unauthorised this is route for instructor"
            })
        }
        next()
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


// isAdmin
exports.isAdmin = async (req, res, next)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(400).json({
                success: false,
                message: "Unauthorised this is route for Admin"
            })
        }
        next()
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
