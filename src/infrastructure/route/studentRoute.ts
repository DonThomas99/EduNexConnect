import express,{Request } from "express";
import studentUsecase from '../../use_case/studentUseCase'
import studentRepo from '../repository/studentRepository'
import studentController from '../../adapter/studentController'

const repository = new studentRepo()
const useCase = new studentUsecase(repository)
const controller = new studentController(useCase)

const studentRoute = express()

studentRoute.post('/login',(req:Request,res)=>{controller.login(req,res)})


export default studentRoute