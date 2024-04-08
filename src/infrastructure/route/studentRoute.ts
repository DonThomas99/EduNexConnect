import express,{Request } from "express";
import studentUsecase from '../../use_case/studentUseCase'
import studentRepo from '../repository/studentRepository'
import studentController from '../../adapter/studentController'

const repository = new studentRepo()
const useCase = new studentUsecase(repository)
const controller = new studentController(useCase)

const studentRoute = express()

studentRoute.post('/login',(req:Request,res)=>{controller.login(req,res)})
studentRoute.get('/fetchStudentData',(req:Request,res)=>{controller.fetchStudentData(req,res)})
studentRoute.get('/fetchSubjects',(req:Request,res)=>{controller.fetchSubjects(req,res)})
studentRoute.get('/fetchAsnmtMat',(req:Request,res)=>{controller.fetchAsnmtMat(req,res)})
studentRoute.get('/fetchAssignments',(req:Request,res)=>{controller.fetchAssignments(req,res)})
studentRoute.get('/fetchRoomId',(req:Request,res)=>{controller.fetchRoomId(req,res)})


export default studentRoute