import tenantController from "../../adapter/tenantController"
import tenantRepository from "../repository/tenantRepository"
import tenantusecase from "../../use_case/tenantUsecase"
import express,{Request} from "express"
import otpGen from "../utils/otpGen"
import sendOtp from "../utils/sendMail"
import HashPassword from "../utils/hashPassword"
import JwtCreate from "../utils/jwtCreate"
import  {getSchema} from "../utils/switchDb"
import { tenantAuth } from "../middlewares/tenant.auth"
import generateStripeSession from "../utils/stripeSubscription"

const repository = new tenantRepository(getSchema)
const stripeSession = new generateStripeSession()
const otp = new otpGen()
const otpSend = new sendOtp()
const hashPassword = new HashPassword()
const jwtCreate = new JwtCreate()
const useCase = new tenantusecase(repository,otpSend,otp,hashPassword,jwtCreate,stripeSession)
const controller =  new tenantController(useCase)

const router = express.Router()
//--------------------Authentication Procedure---------------------
router.post('/signup',(req:Request,res)=>controller.signUp(req,res))
router.post('/signin',(req:Request,res)=>controller.signIn(req,res))

//----------------------OTP Operations-------------------------------
router.post('/verifyOtp',(req:Request,res)=>controller.verifyOtp(req,res))
router.get('/resendOtp',(req:Request,res)=>controller.resendOtp(req,res))

//----------------------Profile CRUD Operations------------------------
router.put('/updateProfile',(req:Request,res)=>controller.updateProfile(req,res))
router.put('/updatePassword',(req:Request,res)=>controller.updatePassword(req,res))

//-----------------------schoolAdmin CRUD Operations-------------------
router.post('/saveAdmin',tenantAuth,(req:Request,res)=>controller.saveAdmin(req,res))
router.get('/adminList',(req:Request,res)=>controller.getAdminList(req,res))

//------------------------Subscription Operations-----------------------
router.get('/fetchPlans',(req:Request,res)=>controller.fetchPlans(req,res))
router.post('/subscribePlan',(req:Request,res)=>controller.subscribePlan(req,res))
router.post('/saveSubscription',(req:Request,res)=>controller.saveSubscription(req,res))

//----------------------- DB CRUD Operations----------------------
router.get('/createDb',(req:Request,res)=>controller.createDb(req,res))

export default router