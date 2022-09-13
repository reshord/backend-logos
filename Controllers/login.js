const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserSchema = require('../Schemas/UserSchema')

const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const isUser = await UserSchema.findOne({email})

        if(!isUser) {
            return res.status(404).json({
                message: 'Пользователя с такой почтой не существует'
            })
        }

        const isCorrectPassword = bcrypt.compare(password, isUser.password)

        if(!isCorrectPassword) {
            return res.status(404).json({
                message: 'Неверный пароль'
            })
        }

        const token = jwt.sign({
            id: isUser._id,
        }, 'secretWord', {expiresIn: '1h'})

        return res.json({
            email,
            token,
            message: 'Авторизация прошла успешно'
        })

    }catch (e) {
        console.error(e);
    }
}

module.exports = {login}