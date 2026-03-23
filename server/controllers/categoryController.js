const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

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

const updateCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            const oldName = category.name;

            if (name && name !== oldName) {
                const categoryExists = await Category.findOne({ name });
                if (categoryExists) {
                    return res.status(400).json({ message: 'Category name already exists' });
                }

                const Product = require('../models/Product');

                category.name = name;
                const updatedCategory = await category.save();

                await Product.updateMany({ category: oldName }, { category: name });

                res.json(updatedCategory);
            } else {
                res.json(category);
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
