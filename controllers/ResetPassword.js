const User = require('../models/User')
const mailsender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
// resetpassword token

exports.resetPasswordToken = async (req, res)=>{
    // get email from req.body
    // check user for this email
    // generate token
    // update user by adding token and expiration time
    // create url 
    // send email
    try {
        const {email} = req.body;
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found with this email"
            })
        }
        const token = crypto.randomUUID();
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 10 * 60 * 1000,
            },
            { new: true } // Return the modified document
          );
          
        const url = `${process.env.COMPANY_URL}/update-password/${token}`;

        await mailsender(email, 
                "password reset link",
                `password reset link ${url}`);

        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
        
    }
    
}


// reset password

exports.resetPassword = async (req, res)=>{

    try {
        
        // date fetch
    // validate
    // get user details using token
    // if no entry - invalid 
    // check expiry time of token 
    // hash password
    // store password
    const { token, password } = req.body;
    const userDetails = await User.findOne({token: token});
    if(!userDetails){
        return res.status(404).json({
            success: false,
            message: "Invalid token"
        })
    }
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.status(400).json({
            success: false,
            message: "Token is expired"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOne({token: token},
        {password: hashedPassword},
        {new: true}
        )
    return res.status(200).json({
        success: true,
        message: "password updated successfully"
    })

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        })
        
    }
}