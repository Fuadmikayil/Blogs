import express from 'express';
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/addBlog', async (req, res) => {
    const { title, content, img } = req.body;
    //check body
    if (!title || !content || !img) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // check token
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // verify token (find which user is adding blog)
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.log("F-> Decoded JWT:", decoded);
        const userId = decoded.id;

        // add blog to db
        const newBlog = new Blog({
            title,
            content,
            img,
            authorID: userId,
        });

        await newBlog.save();
        return res.json({ test: "Blog added successfully" });
    });

});

// public getBlogs route
router.get('/getBlogs', async (req, res) => {
  // fetch all blogs from db
    const blogs = await Blog.find();

    // change authorID to authorName
    const blogsWithAuthorNames = await Promise.all(blogs.map(async (blog) => {
        const user = await User.findById(blog.authorID);
        return {
            _id: blog._id,
            title: blog.title,
            content: blog.content,
            img: blog.img,
            authorName: user?.name || "Unknown",
            authorProfilePicture: user?.profilePicture || "",
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
        };
    }));

    return res.json(blogsWithAuthorNames);

});

export default router;
