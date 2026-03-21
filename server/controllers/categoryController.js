const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const categoryExists = await Category.findOne({ name });

        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            const oldName = category.name;

            // Check if name is taken by another category
            if (name && name !== oldName) {
                const categoryExists = await Category.findOne({ name });
                if (categoryExists) {
                    return res.status(400).json({ message: 'Category name already exists' });
                }

                // Import Product model inside the function to avoid circular dependency if any
                const Product = require('../models/Product');

                // Update the category name
                category.name = name;
                const updatedCategory = await category.save();

                // Update all products that use the old category name
                await Product.updateMany({ category: oldName }, { category: name });

                res.json(updatedCategory);
            } else {
                res.json(category); // No change needed
            }
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory
};
