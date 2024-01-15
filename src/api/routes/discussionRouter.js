const express = require('express');
const discussionRouter = express.Router();
const discussionService = require('../../services/discussionService');
const { authenticate, isActivated } = require('../../middlewares/authMiddleware')
const { validDiscussCreation, validDiscussUpdate } = require('../../middlewares/discussionMiddleware')



discussionRouter.get('', async (req, res) => {
    try {
        const params = { ...req.query }
        const result = await discussionService.getDiscussions(params)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.data });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


discussionRouter.get('/:slugOrId', async (req, res) => {
    try {
        const slugOrId = req.params.slugOrId
        const result = await discussionService.getDiscussion(slugOrId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, discussion: result.discussion });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

})


discussionRouter.use(authenticate)

discussionRouter.get('/u/mydiscussions', async (req, res) => {
    try {
        const authorId = req.user._id
        const params = { ...req.query }

        const result = await discussionService.myDiscussion(authorId, params)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.data });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


discussionRouter.post('', validDiscussCreation, async (req, res) => {
    try {
        const authorId = req.user._id

        const discussionData = req.body 

        const result = await discussionService.createDiscussion(authorId, discussionData)

        if (result.status === 201) {
            return res.status(result.status).json({ message: result.message, discussion: result.discussion });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


discussionRouter.put('/:discussionId', validDiscussUpdate, async (req, res) => {
    try {
        const authorId = req.user._id
        const discussionId = req.params.discussionId
        const updatediscussionData = req.body

        const result = await discussionService.updateDiscussion(authorId, discussionId, updatediscussionData)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, discussion: result.discussion });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


discussionRouter.delete('/:discussionId', async (req, res) => {
    try {
        const authorId = req.user._id
        const discussionId = req.params.discussionId

        const result = await discussionService.deleteDiscussion(authorId, discussionId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, discussion: result.discussion });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = discussionRouter
