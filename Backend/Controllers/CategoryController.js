const Category = require('../Models/CategorieModel');

// Default categories
const DEFAULT_CATEGORIES = [
    { name: 'Alimentation', description: 'Courses, restaurants', color: '#ef4444' },
    { name: 'Transport', description: 'Essence, transport en commun', color: '#3b82f6' },
    { name: 'Loisirs', description: 'Divertissements, hobbies', color: '#8b5cf6' },
    { name: 'Santé', description: 'Médical, pharmacie', color: '#06b6d4' },
    { name: 'Logement', description: 'Loyer, électricité, eau', color: '#f59e0b' },
    { name: 'Travail', description: 'Revenus, salaire', color: '#10b981' },
    { name: 'Investissement', description: 'Épargne, placements', color: '#6366f1' },
    { name: 'Autre', description: 'Autres dépenses', color: '#6b7280' }
];

// Initialize default categories for a user
exports.initializeUserCategories = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Check if user already has categories
        const existingCategories = await Category.findOne({ userId });
        if (existingCategories) {
            return res.status(200).json({ message: 'Categories already exist', categories: [] });
        }

        // Create default categories for the user
        const categoriesToCreate = DEFAULT_CATEGORIES.map(cat => ({
            ...cat,
            userId
        }));

        const createdCategories = await Category.insertMany(categoriesToCreate);
        res.status(201).json({ 
            message: 'Default categories created successfully', 
            categories: createdCategories 
        });
    } catch (error) {
        console.error('Error initializing categories:', error);
        res.status(500).json({ error: 'Error initializing categories' });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('userId', 'username');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
};

// Get categories by user ID
exports.getCategoriesByUser = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.params.userId });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('userId', 'username');
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching category' });
    }
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { userId, name, description, color } = req.body;
        const newCategory = new Category({
            userId,
            name,
            description,
            color: color || '#000000'
        });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ error: 'Error creating category' });
    }
};

// Update category by ID
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        if (name) category.name = name;
        if (description) category.description = description;
        if (color) category.color = color;
        await category.save();
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ error: 'Error updating category' });
    }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
    }
};
