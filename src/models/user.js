const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['moderator', 'user'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: false
    }
});



UserSchema.pre('save', async function (next) {

    const hashedpassword = await bcrypt.hash(this.password, 10);
    this.password = hashedpassword;
    next();
})

UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

UserSchema.methods.isModerator = async function () {
    const user = this
    if (user.role == 'moderator') {
        return true
    }
    return false
}

const User = mongoose.model("User", UserSchema);


module.exports = User;
