import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/register', async (req, res) => {
    // take body
    const {
        username,
        password,
        bio,
        name,
        profilePicture
    } = req.body;

    // check user
    if (!username || !password || !name || !profilePicture || !bio) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // create user
    const newUser = new User({
        username,
        password,
        bio,
        name,
        profilePicture
    })
    await newUser.save();


    res.status(201).json({ message: "User registered successfully" });

})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // check user
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // find user
    const findUser = await User.findOne({ username: username })
    if (!findUser) {
        return res.status(401).json({ message: "User not found" });
    }

    // check password
    if (findUser.password !== password) {
        return res.status(401).json({ message: "User not found" });
    }

    // generate token
    const token = jwt.sign({ id: findUser.id }, SECRET_KEY, { expiresIn: '6h' });

    // set cookie
    return res
        .cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            // secure: true, // enable in production (https)
            maxAge: 6 * 60 * 60 * 1000, // 6 hours
        })
        .json({ message: 'Login successful' })

})

// check user token, is token valid
router.get('/checkToken', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // return user data without password
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
})

// logout user
router.post('/logout', (req, res) => {
    res
        .cookie('token', '', {
            httpOnly: true,
            sameSite: 'lax',
            // secure: true, // enable in production (https)
            maxAge: 0,
        })
        .json({ message: 'Logout successful' });
})

export default router;


