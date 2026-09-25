const Category = require("../models/Category");


// Create Category
const createCategory = async(req,res) => {
    try {
        const {name, image} = req.body;
        const category = await Category.create({name, image});

        return res.status(201).json(({
            success: true,
            message: "Category Created successfully.",
            category,
        }));
    }catch(err){
        res.status(500).json(({
            success: false,
            message: err.message,
        }));
    }
}

// Get All the Category
const getCategories = async(req,res) => {
    try{
        const categories = await Category.find();

        return res.status(200).json(({
            success: true,
            categories,
        }));
    }catch(err){
        res.status(500).json(({
            success: false,
            message: err.message,
        }));
    }
}

// Get Single Category
const getCategory = async(req,res) => {
    try{
        const category = await Category.findById(req.params.id);

        if (!category){
            res.status(404).json({
            success: false,
            message: "category not found.",
        });
        }
        return res.status(200).json({
            success: true,
            category,
        });
    }catch(err){
        res.status(500).json(({
            success: false,
            message: err.message,
        }));
    }
}

// Update Category
const updateCategory = async(req,res) => {
    try{
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );
        if (!category){
            return res.status(404).json({
            success: false,
            message: "Category not found.",
        });
        }
         return res.status(200).json(({
            success: true,
            message: "Category updated successfully.",
            category,
        }));
    }catch(err){
        res.status(500).json(({
            success: false,
            message: err.message,
        }));
    }
}

// Delete Category

const deleteCategory = async(req,res) => {
    try{
        const category = await Category.findByIdAndDelete(
            req.params.id,
        );
        if (!category){
            return res.status(404).json({
            success: false,
            message: "category not found.",
        });
        }
        return res.status(200).json(({
            success: true,
            message: "Category deleted successfully.",
        }));
    }catch(err){
        res.status(500).json(({
            success: false,
            message: err.message,
        }));
    }
}


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};