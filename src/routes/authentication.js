const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const router = express.Router()
const secret = 'my-secret'

const debug = require('debug')('app:routes/authentication')

router.post('/signup', passport.authenticate('signup', {session: false}), async (req, res) => {
    debug('signup')
    res.json({
        message : 'Signup successful',
        user: req.user
    })
})

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        debug('Login info parameter says', info)
        try {
            if (err || !user) {
                const error = new Error('An Error occured')
                debug('Could not auth user',user, 'becaues of error', err)
                return res.sendStatus(401)
            }
            req.login(user, {session: false}, async (error) => {
                if (error) return next(error)

                const body = { _id: user._id, email: user.email}
                const token = jwt.sign({ user: body }, secret)

                return res.json({token})
            })
        } catch(error) {
            return next(error)
        }

    })(req,res,next)
})

module.exports = router;