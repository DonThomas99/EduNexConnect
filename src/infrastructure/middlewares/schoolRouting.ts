import express, { Request, Response, NextFunction } from "express";
import schoolAdminRoute from '../route/schoolAdminRoute';
import teacherRoute from "../route/teacherRoute";
import studentRoute from "../route/studentRoute";
import chatRoute from "../route/chatRoutes";

const router = express.Router();

// Validates :id and copies the known query params onto req.body, so the
// downstream role controllers (which read from req.body) see the same
// fields regardless of whether the client sent a GET with query params or
// a POST body.
const prepareSchoolRequest = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
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

    const validIdRegex = /^[a-f\d]{24}$/i;
    if (!validIdRegex.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    req.body.id = id

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
    if (studentId) {
        req.body.studentId = studentId
    }

    next();
};

router.use('/:id/admin', prepareSchoolRequest, schoolAdminRoute);
router.use('/:id/teacher', prepareSchoolRequest, teacherRoute);
router.use('/:id/student', prepareSchoolRequest, studentRoute);
router.use('/:id/chats', prepareSchoolRequest, chatRoute);

export default router;
