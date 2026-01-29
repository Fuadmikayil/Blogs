import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/users.js';
import blogRoutes from './routes/blogs.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
  origin: ['http://localhost:3000', 'https://blogs-fawn-rho.vercel.app/'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/users', userRoutes)
app.use('/blogs', blogRoutes)

app.get('/', (req, res)=>{
    res.json({message: "Hello from Express Server!"});
});

mongoose.connect(MONGODB_URI)
    .then(()=>{
        console.log("F-> Connected to MongoDB");
    }).catch((err)=>{
        console.error("F-> Failed to connect to MongoDB", err);
    });

app.listen(PORT, ()=>{
    console.log(`F-> Server is running on http://localhost:${PORT}`);
});
