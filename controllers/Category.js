const Category = require('../models/Category');

exports.createCategory = async (req, res)=>{
    try {
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Required all fields"
            })
        }
        const categoryDetails = await Category.create({
            name:name,
        description: description});
        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.showAllCategories = async(req, res)=>{
    try {
        const allCategories = await Category.find({},{name:true, description:true});
        res.status(200).json({
            success: true,
            data: allCategories
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

exports.categoryPageDetails = async (req, res)=>{
    try {
        const {categoryId} = req.body;

        const selectedCategory = await Category.findById(categoryId)
                                            .populate("courses").exec();

        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Courses are not present in this category"
            })
        }
        const differentCategories = await Category.find({_id: {$ne: categoryId}})
                                            .populate("courses")
                                            .exec();
        // todo : get top 10 selling courses

        return res.status(200).json({
            success: true,
            data:{
                "selected_category": selectedCategory,
                "different_categories": differentCategories
            }
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// todo: contact us controller