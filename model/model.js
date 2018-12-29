const mongoose = require('mongoose')
const debug = require('debug')('app:model')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Hook that encrypts the password before save
UserSchema.pre('save', async function(next) {

    const user = this //not a fan of this, need to find a better way
    debug('User in this context is', user)

    const hash = await bcrypt.hash(this.password, 10)

    this.password = hash

    next()
})

UserSchema.methods.isValidPassword = async function(password) {
    const user = this //ugh, this again

    const compare = await bcrypt.compare(password, user.password)
    debug(`${user.password} is a valid password`)
    return compare;
}

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel

