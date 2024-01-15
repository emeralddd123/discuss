const express = require('express');
const apiRouter = express.Router();

const userRouter = require('./routes/userRouter')
const discussionRouter = require('./routes/discussionRouter')
const authRouter = require('./routes/authRouter')
const replyRouter = require('./routes/replyRouter')

const {forwardParam} = require('../middlewares/otherMiddlewares')

apiRouter.use('/users', userRouter);
apiRouter.use('/discussions/:discussionId/reply', forwardParam('discussionId'), replyRouter);
apiRouter.use('/discussions', discussionRouter);
apiRouter.use('/auth', authRouter)

module.exports = apiRouter;
