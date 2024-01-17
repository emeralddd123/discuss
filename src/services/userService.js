const User = require('../models/user');
const jwt = require('jsonwebtoken');
const utils = require('./utils')
require('dotenv').config();


const addModerator = async function (userData) {
    try {

        const existingEmail = await UserModel.findOne({ email: userData.email });
        const existingUsername = await UserModel.findOne({ phoneUsername: userData.username });

        if (existingEmail) {
            return { status: 409, message: "Email already exists" };
        }

        if (existingUsername) {
            return { status: 409, message: "Username already exists" };
        }

        const newUser = await UserModel.create({
            email: userData.email,
            username: userData.username,
            password: userData.password,
        });

        console.log(`Account Created Succesfully for Moderator ${userData.email}`)
        delete newUser.password;

        const token = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });


        return { status: 201, message: `success, Account Created Succesfully!!`, token, data: newUser };
    } catch (error) {
        console.log(error);
        logger.error(`Error Occured wile signing up ${userData.email}, ${error}`)
        return { status: 500, message: error };
    }
}


const signup = async function (userData) {
    try {

        const existingEmail = await User.findOne({ email: userData.email });
        const existingUsername = await User.findOne({ username: userData.username });

        if (existingEmail) {
            return { status: 409, message: "Email already exists" };
        }

        if (existingUsername) {
            return { status: 409, message: "Username already exists" };
        }
        const activationToken = jwt.sign({ email: userData.email, type: 'activation' }, process.env.SECRET_KEY, { expiresIn: '1d' })

        const newUser = await User.create({
            email: userData.email,
            username: userData.username,
            password: userData.password,
        });
        console.log(`Account Created Succesfully for ${userData.email}`)

        delete newUser.password;

        const token = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });


        return { status: 201, message: `success`, token };
    } catch (error) {
        console.log(error);
        return { status: 500, message: error };
    }
}


module.exports = { signup, addModerator }
