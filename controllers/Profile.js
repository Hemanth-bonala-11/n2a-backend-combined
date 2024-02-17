const Profile = require('../models/Profile');
const User = require('../models/User')
exports.updateProfile = async (req,res)=>{
    try {
        const {dob="", about="", contactNumber, gender } = req.body;
        const id = req.user.id

        if(!contactNumber || !gender){
            return res.status(400).json({
                success: false,
                message: "must enter there 2 fields"
            })
        }

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const ProfileDetails = await Profile.findById(profileId);

        ProfileDetails.dateOfBirth = dob;
        ProfileDetails.contactNumber = contactNumber;
        ProfileDetails.gender = gender;
        ProfileDetails.about = about;
        await ProfileDetails.save()

        return res.status(200).json({
            success: true,
            message: "updated profile successfully",
            data: ProfileDetails
        })
            
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
            message: "Unable to update a profile"
        })
    }
}

exports.deleteAccount = async (req, res)=>{
    try {
        const id = req.user.id;


        const user = User.findById(id);
        if(!user){
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        const profileId = user.additionalDetails;
        await Profile.findByIdAndDelete(profileId);
        // todo : unenroll from all enrolled courses
        await User.findByIdAndDelete(id);
        
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        })

        
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
            message: "Unable to delete a profile"
        })
    }
}

exports.getUserDetails = async (req, res)=>{
    try {
        const id = req.user.id;

        const userDetails = User.findById(id).populate("additionalDetails").exec();

        if(!userDetails){
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails,
            message: "fetched user details successfully"
        })

        
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
            message: "Unable to fetch  user"
        })
    }
}