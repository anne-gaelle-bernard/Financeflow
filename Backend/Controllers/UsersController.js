const User = require('../Models/UsersModel');
const Category = require('../Models/CategorieModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

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

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

// Create a new user (Register)
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        
        // Accept either firstName/lastName or username
        const usernameToUse = username || `${firstName} ${lastName}`.trim();
        
        // Validation
        if (!usernameToUse || !email || !password) {
            return res.status(400).json({ error: 'Username (or firstName/lastName), email, and password are required' });
        }
        
        const existingUser = await User.findOne({ $or: [{ email }, { username: usernameToUse }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const newUser = new User({ 
            username: usernameToUse, 
            firstName: firstName || usernameToUse.split(' ')[0],
            lastName: lastName || usernameToUse.split(' ')[1] || '',
            email, 
            password 
        });
        await newUser.save();
        
        // Create default categories for the new user
        try {
            const categoriesToCreate = DEFAULT_CATEGORIES.map(cat => ({
                ...cat,
                userId: newUser._id
            }));
            await Category.insertMany(categoriesToCreate);
            console.log(`✅ Default categories created for user ${newUser._id}`);
        } catch (catError) {
            console.error('Error creating default categories:', catError);
            // Don't fail the registration if categories fail
        }
        
        // Generate JWT token
        const token = generateToken(newUser._id);
        
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully', 
            data: {
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: 'Error registering user', details: error.message });
    }
};

// Update user by ID
exports.updateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = generateToken(user._id);
        
        res.status(200).json({ 
            success: true,
            message: 'Login successful', 
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Error logging in user' });
    }
};
