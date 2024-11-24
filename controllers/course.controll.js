const { validationResult } = require('express-validator')
const Course = require('../models/course.model')
const { SUCCESS, ERROR, FAIL } = require('../utils/httpstatus');
const asyncWrraper = require('../middleware/asyncWrraper');
const appError = require('../utils/appErrors')
const getAllCourses = asyncWrraper(
    async (req, res) => {
        const query = req.query;
        const limit = query.limit || 3;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip)
        res.json({
            status: SUCCESS,
            data: { courses }
        })
    })
const getSingleCourse = asyncWrraper(
    async (req, res, next) => {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            const error = appError.create('Course not found', 404, FAIL);
            return next(error);
        }
        res.json({
            status: SUCCESS,
            data: { course }
        })
    })
const addCourse = asyncWrraper(
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, FAIL)
            return next(error)
        }
        const newCourse = new Course(req.body)
        await newCourse.save()
        res.json({
            status: SUCCESS,
            data: { newCourse }
        })
    })
const updateCourse = asyncWrraper(
    async (req, res) => {
        const courseId = req.params.courseId
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { $set: { ...req.body } })
        res.status(200).json({
            status: SUCCESS,
            data: { updatedCourse }
        })
    })
const deleteCourse = asyncWrraper(
    async (req, res) => {
        const courseId = req.params.courseId
        await Course.findByIdAndDelete(courseId)
        res.status(200).json({
            status: SUCCESS,
            data: null
        })
    })
module.exports = {
    getAllCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse,
}