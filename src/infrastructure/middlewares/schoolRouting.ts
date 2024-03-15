import { Request,Response,NextFunction } from "express";
import schoolAdminRoute from '../route/schoolAdminRoute';
import teacherRoute from "../route/teacherRoute";
import studentRoute from "../route/studentRoute";



// middleware.js
const express = require('express');
const router = express.Router();

// Middleware to extract ID and forward request
router.use('/:id/:role', (req:Request, res:Response, next:NextFunction) => {
    console.log(req.query);
    
    
    const id = req.params.id;
    const role = req.params.role as string;
    const email = req.query.email as string;
    const classNum = req.query.classNum as string;
    const subjectId = req.query.subjectId
    const teacherId = req.query.teacherId
    
    console.log('role:',role);
    console.log('body:',req.body);

    // Validate ID format (you can customize this validation)
    const validIdRegex = /^[a-f\d]{24}$/i;
    if (!validIdRegex.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    req.body.id = id 
    if(email){
        
        req.body.email = email
    }
if(classNum){
    req.body.classNum = classNum
}
if(subjectId){
    console.log('ehew');
    
    req.body.subjectId = subjectId
}
if(teacherId){
    req.body.teacherId = teacherId
}
    
    // Forward request to appropriate route based on role
    if (role === 'admin') {
        return schoolAdminRoute(req, res, next);        
    } else if (role === 'teacher') {  
        return teacherRoute(req,res,next)
        
    } else if (role === 'student') {
        console.log('We are going to reroute');
        return studentRoute(req,res,next)
    } else {
        
        next();
    }

});

export default router;
