import { Request,Response,NextFunction } from "express";
import schoolAdminRoute from '../route/schoolAdminRoute';
import teacherRoute from "../route/teacherRoute";
import studentRoute from "../route/studentRoute";



// middleware.js
const express = require('express');
const router = express.Router();

// Middleware to extract ID and forward request
router.use('/:id/:role', (req:Request, res:Response, next:NextFunction) => {

    const id = req.params.id;
    const role = req.params.role as string;
    const email = req.query.email as string;
    

    // Validate ID format (you can customize this validation)
    const validIdRegex = /^[a-f\d]{24}$/i;
    if (!validIdRegex.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    req.body.id = id 
    if(email){
        
        req.body.email = email
    }

    
    // Forward request to appropriate route based on role
    if (role === 'admin') {
        return schoolAdminRoute(req, res, next);        
    } else if (role === 'teacher') {  
        console.log('We are going to reroute');
        return teacherRoute(req,res,next)
        
    } else if (role === 'student') {
        return studentRoute(req,res,next)
    } else {
        
        next();
    }

});

export default router;
