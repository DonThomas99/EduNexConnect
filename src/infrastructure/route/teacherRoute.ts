import teacherController from "../../adapter/teacherController";
import teacherUseCase from "../../use_case/teacherUseCase";
import express,{Request } from "express";
import teacherRepo from "../repository/teacherRepository";
import { getSchema } from "../utils/switchDb";
import { Multer } from "../middlewares/multer";
import Cloudinary from "../utils/cloudinary"

const cloudinary = new Cloudinary()
const repository = new teacherRepo()
const useCase = new teacherUseCase(repository,cloudinary)
const controller = new teacherController(useCase)

const teacherRoute = express.Router();
teacherRoute.post('/login',(req:Request,res)=>{controller.login(req,res)})
teacherRoute.get('/fetchTeacherData',(req:Request,res)=>{controller.fetchTeacherData(req,res)})
teacherRoute.get('/getStudentsByClass',(req:Request,res)=>{controller.fetchStudents(req,res)})

// Material CRUD operations 
teacherRoute.post('/uploadMaterial',Multer.array('pdf'),(req:Request,res)=>{controller.uploadMaterial(req,res)})
teacherRoute.patch('/updateMaterial',(req:Request,res)=>{controller.updateMaterial(req,res)})
teacherRoute.get('/fetchMaterials',(req:Request,res)=>{controller.fetchMaterials(req,res)})

//Assignment CRUD operations 
teacherRoute.post('/uploadAssignment',(req:Request,res)=>{controller.uploadAssignments(req,res)})
teacherRoute.get('/fetchAssignments',Multer.array('pdf'),(req:Request,res)=>{controller.fetchAssignments(req,res)})
teacherRoute.get('/fetchSubmissions',(req:Request,res)=>{controller.fetchSubmissions(req,res)})
teacherRoute.delete('/deleteAssignment',(req:Request,res)=>{controller.deleteAssignment(req,res)})
teacherRoute.post('/gradeAssignment',(req:Request,res)=>{controller.gradeAssignment(req,res)})


//Online class
teacherRoute.put('/startClass',(req:Request,res)=>{controller.startClass(req,res)})
teacherRoute.put('/endClass',(req:Request,res)=>{controller.endClass(req,res)})

export default teacherRoute