const express = require('express');
const authRouter = express.Router();
const authService = require('../../services/authService')
const { validLoginCreation } = require('../../middlewares/userMiddleware')


authRouter.post('/login',validLoginCreation, async (req, res) => {

    const loginData = req.body
    const result = await authService.login(loginData);

    if (result.status === 201) {
        res.status(result.status).json({ message: result.message, token: result.token });
    } else if (result.status === 400) {
        res.status(result.status).json({ error: result.message });
    } else {
        res.status(result.status).json({ error: result.message });
    }
})


module.exports = authRouter;
