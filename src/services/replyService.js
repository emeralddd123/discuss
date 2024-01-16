const mongoose = require('mongoose')

const Reply = require('../models/reply')
const Discussion = require('../models/discussion')

async function getAllReplies(discussionId) {
    try {
        const replies = await Reply.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(discussionId)                },
            },
            {
                $graphLookup: {
                    from: 'replies',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'replies',
                    as: 'allReplies',
                },
            },
            {
                $unwind: {
                    path: '$allReplies',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $replaceRoot: { newRoot: '$allReplies' },
            },
            {
                $match: {
                    is_deleted: false,
                },
            },
        ]);

        return { status: 200, message: 'Replies fetched successfully', replies };
    } catch (error) {
        console.error('Error fetching replies:', error);
        return { status: 500, message: 'Failed to fetch replies' };
    }
}


async function getReply(replyId) {
    try {
        const reply = await Reply.findById(replyId)

        if (!reply) {
            return { status: 404, message: `reply with id ${replyId} not found`, data: null };
        }

        return { status: 200, message: 'reply fetched successfully', reply: reply };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Server error', data: null };
    }
}

async function addReply(authorId, discussionId, replyData, parentReplyId = null) {
    const { text } = replyData

    try {
        const newReply = new Reply({
            text: text,
            author: authorId,
            is_deleted: false,
        });

        if (parentReplyId) {
            // reply to a reply
            const parentReply = await Reply.findById(parentReplyId);
            if (parentReply) {
                parentReply.replies.push(newReply._id);
                await parentReply.save();
                return { status: 201, message: 'Reply created successfully', data: { reply: newReply, discussion: null } };
            } else {
                throw new Error('Parent reply not found');
            }
        } else {
            await newReply.save();

            // Reply to discussion
            const discussion = await Discussion.findByIdAndUpdate(
                discussionId,
                { $push: { replies: newReply._id } },
                { new: true }
            );

            return { status: 201, message: 'Reply created successfully', data: { reply: newReply, discussion: discussion } };
        }
    } catch (error) {
        console.error(`Error creating reply for discussion ${discussionId}\n${error}`);
        return { status: 500, message: 'Failed to create reply', error: error };
    }
}



module.exports = {
    getAllReplies,
    getReply,
    addReply
};
