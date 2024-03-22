import teacherController from "../../adapter/teacherController";
import teacherUseCase from "../../use_case/teacherUseCase";
import express,{Request } from "express";
import teacherRepo from "../repository/teacherRepository";
import { getSchema } from "../utils/switchDb";

const repository = new teacherRepo()
const useCase = new teacherUseCase(repository)
const controller = new teacherController(useCase)

const teacherRoute = express.Router();
teacherRoute.post('/login',(req:Request,res)=>{controller.login(req,res)})
teacherRoute.get('/fetchTeacherData',(req:Request,res)=>{controller.fetchTeacherData(req,res)})

// Material CRUD operations 
teacherRoute.post('/uploadMaterial',(req:Request,res)=>{controller.uploadMaterial(req,res)})
teacherRoute.patch('/updateMaterial',(req:Request,res)=>{controller.updateMaterial(req,res)})
teacherRoute.get('/fetchMaterials',(req:Request,res)=>{controller.fetchMaterials(req,res)})
teacherRoute.get('/getStudentsByClass',(req:Request,res)=>{controller.fetchStudents(req,res)})

//Assignment CRUD operations 
teacherRoute.post('/uploadAssignment',(req:Request,res)=>{controller.uploadAssignments(req,res)})
export default teacherRoute