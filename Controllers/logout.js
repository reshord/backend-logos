const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserSchema = require('../Schemas/UserSchema')


const logout = async (req, res) => {

    // console.log(req.body.email);

    try {
        const {email} = req.body

        const user = await UserSchema.findOne({email})
       
        if(user) {
            await user.delete()
            return res.status(200).json({message: 'Пользователь удалён'})
        }
        return res.status(400).json({message: 'Something went wrong...'})

    }catch (e) {
        console.error(e);
    }
}

module.exports = {logout}
