const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});


const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
