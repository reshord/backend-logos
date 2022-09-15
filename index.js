const express = require('express')
const cors = require('cors')
const db = require('./products.json')
const dbProdAdvice = require('./productsAdvice.json')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserSchema = require('./Schemas/UserSchema')
const fs = require('fs')
require('dotenv').config()

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.0eazcat.mongodb.net/?retryWrites=true&w=majority'
).then(() => {
    app.listen(port, () => {
        return console.log(`server has been started on ${port}`);
    })
})

const app = express()

app.use(express.json())
app.use(cors())

const port = 4444 || process.env.PORT

app.get('/', (req, res) => {
    return res.json(db)
})

app.get('/cart', (req, res) => {
    return res.json(dbProdAdvice)
})

app.post('/auth/register', async () => {
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
})
app.post('/auth/login', async (req, res) => {
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
})
