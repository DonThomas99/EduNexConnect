import express,{Request } from "express";
import studentUsecase from '../../use_case/studentUseCase'
import studentRepo from '../repository/studentRepository'
import studentController from '../../adapter/studentController'
import { Multer } from "../middlewares/multer";
import Cloudinary from "../utils/cloudinary"



const repository = new studentRepo()
const cloudinary = new Cloudinary()
const useCase = new studentUsecase(repository,cloudinary)
const controller = new studentController(useCase)

const studentRoute = express()

studentRoute.post('/login',(req:Request,res)=>{controller.login(req,res)})

//-------------------Student CRUD Operations-------------------

studentRoute.get('/fetchStudentData',(req:Request,res)=>{controller.fetchStudentData(req,res)})
studentRoute.get('/fetchStudents',(req:Request,res)=>{controller.fetchStudents(req,res)})

//---------------------Subjects CRUD Operations-----------------

studentRoute.get('/fetchSubjects',(req:Request,res)=>{controller.fetchSubjects(req,res)})

//-------------------Student Assignment CRUD Operations---------

studentRoute.get('/fetchAsnmtMat',(req:Request,res)=>{controller.fetchAsnmtMat(req,res)})
studentRoute.get('/fetchAssignments',(req:Request,res)=>{controller.fetchAssignments(req,res)})

//-------------------Online Class-------------------------

studentRoute.get('/fetchRoomId',(req:Request,res)=>{controller.fetchRoomId(req,res)})

//submissions
studentRoute.post('/uploadAssignment',Multer.array('file'),(req:Request,res)=>{ controller.uploadAssignment(req,res)})
studentRoute.get('/fetchSubmissions',(req:Request,res)=>{controller.fetchSubmissions(req,res)})
studentRoute.delete('/deleteSubmissions',(req:Request,res)=>{controller.deleteSubmissions(req,res)})

export default studentRoute