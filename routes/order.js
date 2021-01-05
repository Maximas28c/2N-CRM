const express = require('express')
const router = express.Router()
const controller = require('../controllers/order')
const passport = require('passport')

router.get('/', passport.authenticate('jwt',{session:false}),controller.getAll)
router.post('/', passport.authenticate('jwt',{session:false}),controller.create)

module.exports = router