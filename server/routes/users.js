import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // bcrypt əlavə etdik
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Qeydiyyat (Register) Endpoint
router.post('/register', async (req, res) => {
    const { username, password, bio, name, profilePicture } = req.body;

    // Bütün sahələr dolu olmalıdır
    if (!username || !password || !name || !profilePicture || !bio) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Şifrəni şifrələyirik
        const salt = await bcrypt.genSalt(10); // 10 - şifrəni şifrələmək üçün istifadə edilən "salt" sayısı
        const hashedPassword = await bcrypt.hash(password, salt); // Şifrəni şifrələyirik

        // Yeni istifadəçi yaratmaq
        const newUser = new User({
            username,
            password: hashedPassword, // Şifrəni şifrələnmiş formada saxlayırıq
            bio,
            name,
            profilePicture
        });

        // İstifadəçini bazaya əlavə et
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Giriş (Login) Endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // İstifadəçini tap
        const findUser = await User.findOne({ username: username });
        if (!findUser) {
            return res.status(401).json({ message: "User not found" });
        }

        // Şifrəni doğrula
        const isMatch = await bcrypt.compare(password, findUser.password); // Şifrəni doğrulamaq
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Token yarat
        const token = jwt.sign({ id: findUser.id }, SECRET_KEY, { expiresIn: '6h' });

        // Cookie-yə token əlavə et
        return res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 6 * 60 * 60 * 1000, // 6 saat
            })
            .json({ message: 'Login successful' });

    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Token doğrulaması (checkToken)
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
        return res.status(200).json({ user });
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Unauthorized" });
    }
});

// Logout (çıkış)
router.post('/logout', (req, res) => {
    res
        .cookie('token', '', {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 0,
        })
        .json({ message: 'Logout successful' });
});

export default router;
