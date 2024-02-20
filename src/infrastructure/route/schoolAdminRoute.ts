import schoolAdminController from "../../adapter/schoolAdminController";
import schoolAdminUseCase from "../../use_case/schoolAdminUseCase";
import schoolAdminRepo from "../repository/schoolAdminRepo";
import JwtCreate from "../utils/jwtCreate";
import express,{Request } from "express";
import passwordGenerator  from "../utils/passwordGenerator"
// import schoolAdmin from "../../domain/schoolAdmin";


const pwdGen = new passwordGenerator()
const repository = new schoolAdminRepo
const jwt = new JwtCreate()
const usecase = new schoolAdminUseCase(pwdGen,repository,jwt)
const controller  = new schoolAdminController(usecase)



const schoolAdminRouter = express.Router()

schoolAdminRouter.post('/login',(req:Request,res)=>{controller.schoolAdminLogin(req, res)})
schoolAdminRouter.post('/addSubjects',(req:Request,res)=>{controller.addSubject(req,res)})
schoolAdminRouter.post('/addTeachers',(req:Request,res)=>{controller.addTeacher(req,res)})
schoolAdminRouter.get('/fetchClasses',(req:Request,res)=>{controller.fetchClasses(req,res)})

    export default schoolAdminRouter