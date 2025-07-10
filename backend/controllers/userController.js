import user from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token will expire in 30 days
    });
}







export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await user.findOne({ email })
        if (userExists) {                     
            return res.status(400).json({ message: 'User already exists' });
        }
        if(password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);



        // Create new user
        const newUser = await user.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser._id) // Generate JWT token
        });
    }

    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }

}


//Login Function 

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(500).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(500).json({ message: 'Invalid email or password' });
        }

        res.status(201).json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            token: generateToken(existingUser._id) // Generate JWT token
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


//GET User Profile function ---


export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming req.user is set by authentication middleware
        const userProfile = await user.findById(userId).select('-password'); // Exclude password from response

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}