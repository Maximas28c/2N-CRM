const User = require ('../models/User')
const keys = require('../config/keys')
const JWT = require('jsonwebtoken')
const BCrypt = require ('bcryptjs')

const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res){
    const candidate = await User.findOne({email: req.body.email})

    if (candidate){
        //check pass
        const passwordResult = BCrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult){
            //token generation
            const token = JWT.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.JWT,{expiresIn: 60*60})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            //
            res.status(401).json({
                message: 'passwords did not matched'
            })
        }
    } else {
        //fuck off
        res.status(404).json({
            message:'user with this email was not founded'
        })
    }
}

module.exports.register = async function(req, res){
    //email password

    const candidate = await User.findOne({
        email: req.body.email
    })

    if (candidate) {
        // ошибка существующего пользователя
        res.status(409).json({
            messege: 'User already created. try to login'
        })
    } else {
        // обработка регистрации
        const salt = BCrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: BCrypt.hashSync(password, salt)
        })
        
        try {
            await user.save()
            res.status(201).json(user)
        } catch(e) {
            errorHandler(res, e)
        }
    }
}