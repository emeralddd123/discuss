const express = require('express');
const apiRouter = express.Router();

const userRouter = require('./routes/userRouter')
const discussionRouter = require('./routes/discussionRouter')
const authRouter = require('./routes/authRouter')
const replyRouter = require('./routes/replyRouter')

const { forwardParam } = require('../middlewares/otherMiddlewares')

apiRouter.use('/users', userRouter);
apiRouter.use('/discussion/:discussionId/reply', forwardParam('discussionId'), replyRouter);
apiRouter.use('/discussion', discussionRouter);
apiRouter.use('/auth', authRouter)

apiRouter.get('*', async (req, res) => {
    res.status(404).json({ message: 'Resource Not Found' })
})

apiRouter.post('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint does not exist' });
});

module.exports = apiRouter;
