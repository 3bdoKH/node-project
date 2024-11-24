require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose')
const uri = process.env.MONGO_URL
const { SUCCESS, ERROR, FAIL, } = require('./utils/httpstatus')
const path = require('path')
mongoose.connect(uri).then(() => {
    console.log("mongodb server started")
})
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(cors())
app.use(express.json())
const coursesRout = require('./routes/course.rout')
const usersRout = require('./routes/user.rout')
app.use('/api/courses', coursesRout)
app.use('/api/users', usersRout)
app.all('*', (req, res, next) => {
    return res.status(404).json({
        status: ERROR,
        message: 'This resourse is not available'
    })
})
app.use((err, req, res, next) => {
    res.status(err.code || 500).json({
        status: err.text || ERROR,
        message: err.message,
        code: err.code || 500,
        data: null
    })
})
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})

