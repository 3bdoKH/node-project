const express = require('express');
const router = express.Router();
const { getAllUsers, register, login } = require('../controllers/users.controller')
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const { userRoles } = require('../utils/userRoles');
const multer = require('multer');
const appError = require('../utils/appErrors');
const { SUCCESS, ERROR, FAIL } = require('../utils/httpstatus')
const deskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1]
        const unique = `${req.body.firstName.toLowerCase()}-${Date.now()}.${ext}`
        cb(null, unique)
    }
})
const fileFilter = (req, file, cb) => {
    const type = file.mimetype.split('/')[0]
    if (type !== 'image') {
        return cb(appError.create('File Must Be An Image', 400, FAIL), false)
    } else {
        return cb(null, true)
    }
}
const upload = multer({ storage: deskStorage, fileFilter: fileFilter })


router.route('/')
    .get(verifyToken, allowedTo(userRoles.ADMIN), getAllUsers)

router.route('/register')
    .post(upload.single('avatar'), register)

router.route('/login')
    .post(login)

module.exports = router;
