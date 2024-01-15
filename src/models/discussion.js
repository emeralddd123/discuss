const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    heading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

Schema.index({ timestamp: -1 });

const Blog = mongoose.model("Blog", Schema);

module.exports = Blog;
