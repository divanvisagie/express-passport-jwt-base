const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const UserModel = require('../model/user-model')

const  JWTStrategy = require('passport-jwt').Strategy
const  ExtractJWT = require('passport-jwt').ExtractJwt

passport.use(new JWTStrategy({
    secretOrKey: 'my-secret',
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
    try {
        return done(null, token.user)
    } catch (error) {
        done(error)
    }
}))


//passport middleware for user registration
passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.create({email, password})
        return done(null, user)
    } catch (e) {
        done(e)
    }
}))

//passport middleware for login
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            debug('incorrect username')
            return done(null, false, {message: 'Username or password incorrect'})
        }

        const validate = await user.isValidPassword(password)
        if (!validate) {
            debug('incorrect password')
            return done(null, false, {message: 'Username or password incorrect'})
        }

        return done(null, user, {message: 'Logged in successfully'})
    } catch (e) {
        return done(e)
    }
}))

