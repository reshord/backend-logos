const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserSchema = require('../Schemas/UserSchema')


const register = async (req, res) => {
    try {
        const {email, password, confirmPassword} = req.body

        if(confirmPassword !== password) {
            return res.status(404).json({
                message: 'Пароли не совпадают'
            })
        }

        const isUser = await UserSchema.findOne({email})
       
        if(isUser) {
            return res.status(404).json({message: 'Пользователь уже существует'})
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const hash2 = bcrypt.hashSync(confirmPassword, salt)

        const user = UserSchema({
            email,
            password: hash,
            confirmPassword: hash2
        })

        const token = jwt.sign({
            id: user._id,
        }, 'secretWord', {expiresIn: '1h'})

        await user.save()

        return res.status(200).json({
            user,
            token,
            message: 'Учетная запись успешно создана'
        })

    }catch (e) {
        console.error(e);
    }
}

module.exports = {register}



