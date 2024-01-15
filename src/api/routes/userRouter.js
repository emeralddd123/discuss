const express = require('express');
const userRouter = express.Router();
const userService = require('../../services/userService');
const { validUserCreation } = require('../../middlewares/userMiddleware');


userRouter.post('/signup', validUserCreation, async (req, res) => {
    try {
        const userData = req.body
        const result = await userService.signup(userData);

        if (result.status === 201) {
            res.status(result.status).json({ message: result.message, value: result.token });
        } else if (result.status === 400) {
            res.status(result.status).json({ error: result.message });
        }
        else {
            res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = userRouter;
