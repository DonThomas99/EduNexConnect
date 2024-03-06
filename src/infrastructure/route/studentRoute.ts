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


export default studentRoute