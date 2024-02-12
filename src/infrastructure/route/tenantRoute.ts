import tenantController from "../../adapter/tenantController"
import tenantRepository from "../repository/tenantRepository"
import tenantusecase from "../../use_case/tenantUsecase"
import express,{Request} from "express"
import otpGen from "../utils/otpGen"
import sendOtp from "../utils/sendMail"
import HashPassword from "../utils/hashPassword"
import JwtCreate from "../utils/jwtCreate"
import  {getSchema} from "../utils/switchDb"

const repository = new tenantRepository(getSchema)
const otp = new otpGen()
const otpSend = new sendOtp()
const hashPassword = new HashPassword()
const jwtCreate = new JwtCreate()
const useCase = new tenantusecase(repository,otpSend,otp,hashPassword,jwtCreate)
const controller =  new tenantController(useCase)

const router = express.Router()

router.post('/signup',(req:Request,res)=>controller.signUp(req,res))
router.post('/signin',(req:Request,res)=>controller.signIn(req,res))
router.post('/verifyOtp',(req:Request,res)=>controller.verifyOtp(req,res))
router.put('/updateProfile',(req:Request,res)=>controller.updateProfile(req,res))
router.put('/updatePassword',(req:Request,res)=>controller.updatePassword(req,res))
router.post('/saveAdmin',(req:Request,res)=>controller.saveAdmin(req,res))
router.get('/SchoolAdminList',(req:Request,res)=>controller.getAdminList(req,res))
router.get('/createDb',(req:Request,res)=>controller.createDb(req,res))
router.get('/resendOtp',(req:Request,res)=>controller.resendOtp(req,res))
export default router