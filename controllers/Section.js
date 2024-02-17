const Section = require('../models/Section');
const Course = require('../models/Course')

exports.createSection = async (req, res)=>{
    try {
        const {sectionName, courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const newSection = await Section.create({sectionName: sectionName});

        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{
            $push: {
                courseContent: newSection._id
            }
        },{new: true}).populate("courseContent").exec();
        // todo: to populate subsection in course content model(section model)

        return res.status(200).json({
            success: true,
            message: "section created successfully",
            data: updatedCourseDetails
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
            message: "Unable to create a section"
        })
    }
}

exports.updateSection = async (req, res)=>{
    try {
        const {sectionName, sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const updatedSectionDetails = await Section.findByIdAndUpdate(sectionId,{
            sectionName: sectionName
        },{new: true}).populate("subSections");
        return res.status(200).json({
            success: true,
            message: "Section updated successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
            message: "Unable to update a section"
        })
    }
}

exports.deleteSection = async (req, res)=>{
    try {
        const {sectionId, courseId} = req.body;
        const deletedSectionDetails = await Section.findByIdAndDelete(sectionId);
        // todo: dowe need to delete the entry from the course schema?? ==> no , since section is deleted , course cannot point to deleted section 
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