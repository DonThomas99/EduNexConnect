import { Request, Response, NextFunction } from "express";
import schoolAdminRoute from '../route/schoolAdminRoute';
import teacherRoute from "../route/teacherRoute";
import studentRoute from "../route/studentRoute";
import { Multer } from "../middlewares/multer";
import chatRoute from "../route/chatRoutes";




// middleware.js
const express = require('express');
const router = express.Router();



// Middleware to extract ID and forward request
router.use('/:id/:role', (req: Request, res: Response, next: NextFunction) => {
    
    const id = req.params.id;
    if (req.params.tenantId) {
        console.log(req.params.tenantId);
    }
    const role = req.params.role as string;
    const email = req.query.email as string;
    const classNum = req.query.classNum as string;
    const subjectId = req.query.subjectId
    const teacherId = req.query.teacherId
    const page = req.query.page
    const limit = req.query.limit
    const assignmentId = req.query.assignmentId
    const materialId = req.query.materialId
    const studentEmail = req.query.studentEmail
    const studentId = req.query.studentId
    const tenantId = req.query.id
    const number = req.query.number

    // Validate ID format (you can customize this validation)
    const validIdRegex = /^[a-f\d]{24}$/i;
    if (!validIdRegex.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }    
    if (id) {

        req.body.id = id
    } else {
        console.log('no id detected');

    }
    if (tenantId) {
        req.body.id = tenantId
    }
    if (assignmentId) {
        req.body.assignmentId = assignmentId
    }
    if (studentEmail) {
        req.body.studentEmail = studentEmail
    }
    if (email) {

        req.body.email = email
    }
    if (classNum) {
        req.body.classNum = classNum
    }
    if (subjectId) {
        req.body.subjectId = subjectId
    }
    if (teacherId) {
        req.body.teacherId = teacherId
    }
    if (page) {
        req.body.page = page
    }
    if (limit) {
        req.body.limit = limit
    }

    if (number) {
        req.body.number = number
    }

    if (materialId) {
        req.body.materialId = materialId
    }

    if(studentId){
        req.body.studentId = studentId
    }

    // Forward request to appropriate route based on role
    if (role === 'admin') {

        return schoolAdminRoute(req, res, next);
    } else if (role === 'teacher') {
        return teacherRoute(req, res, next)

    } else if (role === 'student') {

        return studentRoute(req, res, next)

    }else if(role ==='chats'){

        return chatRoute(req,res,next)

    } else {

        next();
    }

});

export default router;
