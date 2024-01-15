const Reply = require('../models/reply')


async function getAllReplies(discussionId) {
    try {
        const replies = await Reply.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(discussionId),
                    is_deleted: false,
                },
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

        return replies;
    } catch (error) {
        console.error('Error fetching replies:', error);
        throw new Error('Failed to fetch replies');
    }
}

module.exports = {
    getAllReplies,
};
