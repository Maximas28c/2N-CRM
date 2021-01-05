const passport = require('passport')
const keys = require('../config/keys')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('users')


const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.JWT
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select('email id')

                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (e) {
                console.log(e)
            }
        })
    )
}