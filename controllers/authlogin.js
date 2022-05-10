const Users = require("../models/authlogin");
const jwt = require('jsonwebtoken')
const tokenSecret = 'my-token-secret'
const bcrypt = require('bcrypt')
const rounds = 10

const registerUser = async (req, res) => {
    try {
        bcrypt.hash(req.body.password, rounds, async (err, hash) => {
            if (err) res.status(500).json(err)
            else {
                const user = new Users({
                    email: req.body.email,
                    password: hash,
                })
                const createBlog = await user.save()
                res.status(201).json({
                    status: true, accessToken: gerenateToken(createBlog)
                })
            }
        })
    } catch (e) {
        res.status(400).json({ status: false, result: e.message })
    }
}
const userData = (req, res) => {
    try {
        Users.findOne({ email: req.body.email }).then(user => {
            if (!user) res.status(500).json({ error: 'No user found.' })
            else {
                bcrypt.compare(req.body.password, user.password, async (err, match) => {
                    if (err) res.status(500).json(err)
                    else if (match) res.status(201).json({
                        status: true, accessToken: gerenateToken(user)
                    })
                    else res.status(403).json({ error: 'Password do not match' })
                })
            }
        })
    } catch (e) {
        res.status(400).json({ status: false, result: e.message })
    }
}
const usersData = (req, res) => {
    try {
        Users.find().then((data) => {
            res.status(201).json({
                status: true, data
            })
        })
    } catch (e) {
        res.status(500).json(e)
    }
}
gerenateToken = (user) => {
    return jwt.sign({ data: user }, tokenSecret)
}

module.exports = { registerUser, userData, usersData }