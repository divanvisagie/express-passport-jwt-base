const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()

const config = require('./src/config/config')

const debug = require('debug')('app')


mongoose.connect(config.mongoUrl, { 
    useNewUrlParser: true 
})
mongoose.connection.on('error', error => debug(error))
mongoose.Promise = global.Promise

require('./src/auth/auth')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const authentication = require('./src/routes/authentication')
const user = require('./src/routes/user')

app.use('/', authentication)
app.use('/user', passport.authenticate('jwt', {session: false}), user)

//error handler
app.use((err, req, res) => {
    res.status(err.status || 500)
    res.json({error: err})
}) 

app.listen(config.port, () => {
    debug(`Server started on port ${config.port}`)
})