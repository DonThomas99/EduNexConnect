import superAdminController from "../../adapter/superAdminController";
import SuperAdminRepository from "../repository/superAdminRepository";
import superAdminUseCase from "../../use_case/superAdminUseCase";
import express,{Request, Response} from "express";
import JwtCreate from "../utils/jwtCreate";
import tenantRepository from "../repository/tenantRepository";
import tenantUsecase from "../../use_case/tenantUsecase";
import {getSchema} from "../utils/switchDb"

const repository = new SuperAdminRepository()
const jwt = new JwtCreate()
const trepository = new tenantRepository(getSchema)
const useCase = new superAdminUseCase(repository,trepository,jwt)
const controller = new superAdminController(useCase)

const superAdminRouter = express.Router()

superAdminRouter.post('/login',(req:Request,res)=>controller.adminLogin(req,res))

//----------------Subscription Operations--------------------------
superAdminRouter.post('/addPlan',(req:Request,res)=>controller.addPlan(req,res))
superAdminRouter.get('/fetchPlans',(req:Request,res)=>controller.fetchPlans(req,res))
//-------------------------Tenant Operations------------------------
superAdminRouter.get('/tenantList',(req:Request,res)=>controller.tenantList(req,res))
superAdminRouter.put('/blockTenant',(req:Request,res)=>controller.blockUnblock(req,res))
superAdminRouter.get('/TenantData/:TenantId',(req:Request,res)=>controller.getTenantData(req,res))

//---------------------------Banners-------------------------------------------------
superAdminRouter.post('/Banner',(req:Request,res)=>{controller.addBanner(req,res)})
superAdminRouter.get('/Banner',(req:Request,res)=>{controller.fetchBanner(req,res)})
superAdminRouter.delete('/Banner',(req:Request,res)=>{controller.deleteBanner(req,res)})

export default superAdminRouter 