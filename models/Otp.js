const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
})

// function to send email
async function sendVerifiationEmail(email, otp){
    try{

        const mailResponse = await mailSender(email, " Verification Email from Neophyte2Adept ", otp);
        console.log("Email sent successfully", mailResponse)
    }catch(err){
        console.log("Error while sending mail ", err.message);
        throw err;
    }
}
otpSchema.pre("save", async function(next){
    await sendVerifiationEmail(this.email, this.otp);
    next();
})
module.exports = mongoose.model("Otp", otpSchema)