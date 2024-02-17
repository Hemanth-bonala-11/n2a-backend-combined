const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadFileToCloudinary} = require('../utils/imageUploader');
require('dotenv').config();

exports.createSubSection = async (req, res)=>{
    try {
        const {sectionId, title, duration, description} = req.body;
        const videoFile = req.files.videoFile;
        if(!sectionId || !title || !duration || !description || !videoFile){
            return res.status(400).json({
                success: false,
                message: "Required all fields"
            })
        } 
        const uploadedFileDetails = await uploadFileToCloudinary(videoFile, process.env.COURSE_FOLDER);

        const subSectionDetails = await SubSection.create({
            title: title,
            description: description,
            timeDuration: duration,
            videoUrl: videoFile
        });

    const sectionUpdatedDetials = await Section.findByIdAndUpdate(sectionId,{
        $push:{
            subSections: subSectionDetails._id
        }
    },
      {new: true} );
      // todo: populate all sectiondetails with subsection details

    return res.status(200).json({
        success: true,
        message: "Subsection created successfully",
        data: sectionUpdatedDetials
    })

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
            message: "Unable to create a subsection"
        })
    }
}

// update subsection controller



exports.deleteSubSection = async (req, res)=>{
    try {
        const {sectionId, subSectionId} = req.params;
        const deletedSubSectionDetails = await SubSection.findByIdAndDelete(subSectionId);
        // todo: dowe need to delete the entry from the Section schema or will id removed automatically??
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
            message: "Unable to delete a section"
        })
    }
}