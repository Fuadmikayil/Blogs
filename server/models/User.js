import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    }],
});

export default mongoose.model('User', userSchema); 