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
export default teacherRoute