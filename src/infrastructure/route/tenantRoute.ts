import tenantController from "../../adapter/tenantController"
import tenantRepository from "../repository/tenantRepository"
import tenantusecase from "../../use_case/tenantUsecase"
import express,{Request} from "express"
import otpGen from "../utils/otpGen"
import sendOtp from "../utils/sendMail"

const repository = new tenantRepository()
const useCase = new tenantusecase(repository)
const otp = new otpGen()
const otpSend = new sendOtp
const controller =  new tenantController(useCase,otp,otpSend)

const router = express.Router()

router.get('/tenant/signup',(req:Request,res)=>controller.signUp(req,res))
router.post('/tenants/signup')
router.get('/tenant/signin',(req:Request,res)=>controller.signIn(req,res))

export default router