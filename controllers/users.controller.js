const asyncWrraper = require('../middleware/asyncWrraper')
const User = require('../models/user.model')
const { SUCCESS, ERROR, FAIL } = require('../utils/httpstatus')
const { validationResult } = require('express-validator')
const appError = require('../utils/appErrors')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const generateJWT = require('../utils/generateJWT')
const getAllUsers = asyncWrraper(
    async (req, res) => {
        const query = req.query;
        const limit = query.limit || 3;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        const users = await User.find({}, { "__v": false, "password": false }).limit(limit).skip(skip)
        res.json({
            status: SUCCESS,
            data: { users }
        })
    })

const register = asyncWrraper(
    async (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body
        const isExist = await User.findOne({ email: email })
        if (isExist) {
            const err = appError.create("User Already Exists", 400, FAIL)
            return next(err)
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar: req.file.filename
        })
        const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role })
        newUser.token = token
        await newUser.save()
        res.status(201).json({
            status: SUCCESS,
            data: { newUser }
        })
    })

const login = asyncWrraper(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        const err = appError.create("Email And Password Are Required", 400, FAIL)
        return next(err)
    }
    const user = await User.findOne({ email: email })
    if (!user) {
        const err = appError.create("User Does Not Exist", 400, FAIL)
        return next(err)
    }
    const matchedPassword = await bcrypt.compare(password, user.password)
    if (user && matchedPassword) {
        const token = await generateJWT({ email: user.email, id: user._id, role: user.role })
        return res.status(200).json({ status: SUCCESS, data: { token } })
    } else {
        const err = appError.create("Somthing Went Wrong", 500, ERROR)
        return next(err)
    }
})

module.exports = {
    getAllUsers,
    register,
    login,
}