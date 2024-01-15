const jwt = require('jsonwebtoken')
require('dotenv').config()

const checkIfUser = (req, res, next) => {
    // just a function to check if a user is logged in
    // unlike fn aunthenticate, it is not going to do anything to the not logged in user
    // just a way of passing user into req.user of non-protected routes

    try {
        const token = req.cookies.jwt
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedToken.user
    } catch (error) {
        // do nothing
    }

    next()
}


const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedToken.user
    } catch (error) {
        return res.redirect('/login')
    }

    next()
}



const isActivated = (req, res, next) => {
    try {
        if (req.user.active !== true) {
            return res.redirect('/resend-activation-mail') //, { message: "Please Activate your account to perform ths action" }
        }
    } catch (error) {
        return res.redirect('/errorPage') //, { error: error }
    }
    next()
}


module.exports = { checkIfUser, authenticate, isActivated }
