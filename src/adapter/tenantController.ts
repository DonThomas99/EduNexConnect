import { Request,Response } from "express";
import tenantUsecase from "../use_case/tenantUsecase"
import tenants from "../domain/tenants";
import otpGen from "../infrastructure/utils/otpGen"
import sendMail from "../infrastructure/utils/sendMail"

class tenantController {
    private tenantCase:tenantUsecase
    private otpGen:otpGen;
    private sendMail:sendMail;
    constructor(
        tenantCase:tenantUsecase,
        otpGen:otpGen,
        sendMail:sendMail
        ){
        this.tenantCase= tenantCase
        this.sendMail = sendMail
        this.otpGen = otpGen
    }
        async signUp(req:Request,res:Response){
            try {
                const otp = await this.otpGen.genOtp(4)
                this.sendMail.sendMail(req.body.name,req.body.email,otp);
                const tenant = await this.tenantCase.signup(req.body)
                req.app.locals.otp = otp
                res.status(tenant.status).json(tenant.data)
            } catch (error) {
                console.log(error);
                
            }
        }
    async signIn(req:Request,res:Response){
        try {
            const tenant:any = await this.tenantCase.signIn(req.body)
            res.status(tenant.status).json(tenant.data)
        } catch (error) {
    console.log(error);
                
        }
    }

    async signOut(req:Request,res:Response){
        try {
            
        } catch (error) {
        console.log(error);
                    
        }
    }
    
}

export default tenantController 