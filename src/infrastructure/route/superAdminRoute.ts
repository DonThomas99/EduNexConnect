import superAdminController from "../../adapter/superAdminController";
import SuperAdminRepository from "../repository/superAdminRepository";
import superAdminUseCase from "../../use_case/superAdminUseCase";
import express,{Request} from "express";
import JwtCreate from "../utils/jwtCreate";
import tenantRepository from "../repository/tenantRepository";
import tenantUsecase from "../../use_case/tenantUsecase";

const repository = new SuperAdminRepository()
const jwt = new JwtCreate()
const trepository = new tenantRepository()
const useCase = new superAdminUseCase(repository,trepository,jwt)
const controller = new superAdminController(useCase)

const superAdminRouter = express.Router()
superAdminRouter.post('/login',(req:Request,res)=>controller.adminLogin(req,res))
superAdminRouter.get('/tenantList',(req:Request,res)=>controller.tenantList(req,res))
superAdminRouter.put('/blockTenant',(req:Request,res)=>controller.blockUnblock(req,res))

export default superAdminRouter 