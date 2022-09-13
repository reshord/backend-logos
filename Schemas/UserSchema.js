const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: false
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String
    }
})

module.exports = mongoose.model('User', UserSchema)