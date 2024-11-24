const jwt = require('jsonwebtoken')
const appError = require('../utils/appErrors')
const { FAIL } = require('../utils/httpstatus')
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if (!authHeader) {
        const error = appError.create('Token is required', 401, FAIL);
        return next(error);
    }
    const token = authHeader.split(' ')[1]
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.currentUser = currentUser;
        next()
    } catch (e) {
        const error = appError.create('Invalid Token', 401, FAIL);
        return next(error);
    }
}
module.exports = verifyToken