import schoolAdminController from "../../adapter/schoolAdminController";
import schoolAdminUseCase from "../../use_case/schoolAdminUseCase";
import JwtCreate from "../utils/jwtCreate";
import express,{Request } from "express";

const jwt = new JwtCreate()
const usecase = new schoolAdminUseCase()
const controller  = new schoolAdminController(usecase)



const schoolAdminRouter = express.Router()

schoolAdminRouter.post('/login',(req:Request,res)=>{
 console.log(req.body.id);
 
    controller.schoolAdminLogin(req, res)
})

    export default schoolAdminRouter