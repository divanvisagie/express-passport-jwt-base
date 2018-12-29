const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()
// const UserModel = require('./model/model')

const debug = require('debug')('app')

const port = 3000

mongoose.connect('mongodb://localhost:27017/express-passport')
mongoose.connection.on('error', errpr => debug(error))
mongoose.Promise = global.Promise

require('./auth/auth')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const routes = require('./routes/routes')
const secureRoutes = require('./routes/secure-routes')

app.use('/', routes)
app.use('/user', passport.authenticate('jwt', {session: false}), secureRoutes)

//error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({error: err})
}) 

app.listen(port, () => {
    debug(`Server started on port ${port}`)
})