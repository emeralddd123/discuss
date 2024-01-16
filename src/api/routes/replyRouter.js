const express = require('express');
const replyRouter = express.Router();
const replyService = require('../../services/replyService');
const { authenticate } = require('../../middlewares/authMiddleware')

replyRouter.get('', async (req, res) => {
    try {
        const discussionId = req.discussionId

        const result = await replyService.getAllReplies(discussionId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.replies });
        } else {
            return res.status(result.status).json({ error: result.message });
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });

    }
})


replyRouter.get('/:replyId', async (req, res) => {
    try {
        const replyId = req.params.replyId
        const result = await replyService.getReply(replyId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.reply });
        } else {
            return res.status(result.status).json({ error: result.message });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


replyRouter.use(authenticate)


replyRouter.post('', async (req, res) => {
    try {
        const discussionId = req.discussionId
        const authorId = req.user._id
        const replyData = { text, parentReplyId } = req.body
        console.log({discussionId})
        if (!replyData.text) {
            return res.status(400).json({ error: `text required in the body` })
        }

        const result = await replyService.addReply(authorId, discussionId, replyData, parentReplyId)

        if (result.status === 201) {
            return res.status(result.status).json({ message: result.message, data: result.data });
        } else {
            return res.status(result.status).json({ error: result.message });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})



module.exports = replyRouter
