const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/verifyToken')
const allowedTo = require('../middleware/allowedTo')
const { getAllCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse,
} = require('../controllers/course.controll');
const { userRoles } = require('../utils/userRoles');



router.route('/')
    .get(getAllCourses)
    .post(
        verifyToken,
        allowedTo(userRoles.ADMIN),
        body('title')
            .notEmpty()
            .withMessage("Title is required")
            .isLength({ min: 2 })
            .withMessage("Name must be at least 2 characters"),
        body('price')
            .notEmpty()
            .withMessage("Price is required"),
        addCourse
    );
router.route('/:courseId')
    .get(getSingleCourse)
    .patch(
        verifyToken,
        allowedTo(userRoles.ADMIN),
        updateCourse)
    .delete(
        verifyToken,
        allowedTo(userRoles.ADMIN),
        deleteCourse)

module.exports = router;
