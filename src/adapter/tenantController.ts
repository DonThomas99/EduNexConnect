import { Request,Response } from "express";
import tenantUsecase from "../use_case/tenantUsecase"
import { ITenants } from "../domain/tenants";
// import tenants from "../domain/tenants";


class tenantController {
    private tenantCase:tenantUsecase

    constructor(
        tenantCase:tenantUsecase        ){
        this.tenantCase= tenantCase
        
    }
        async signUp(req:Request,res:Response){
            try {     
                console.log(req.body);
                const tenantData = req.body.tenantData
                
                const tenant = await this.tenantCase.signup(tenantData)
                if(!tenant.data.data){
                    req.app.locals.tenant = tenantData
                    req.app.locals.otp = tenant.data.otp
                    res.status(200).json({data:tenant})
                } else{
                    res.status(409).json({data:false})
                }

                console.log('sending response');
            } catch (error) {
                console.log(error);
                res.status(500).json({message:(error as Error).message, data:null})
            }
        }
    async signIn(req:Request,res:Response){
        try {
            const loginStatus = await this.tenantCase.signIn(req.body.email,req.body.password)
            
            res.status(loginStatus.status).json(loginStatus)
            // if(tenant)
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

    async verifyOtp(req:Request,res:Response){
        try {
            // console.log(req.body);
            const otpBody:string = req.body.otp
            const otpSaved:string = req.app.locals.otp
            if (otpBody === otpSaved){
                const tenant = req.app.locals.tenant
                const save  = await this.tenantCase.tenantSave(tenant)
                if(save){
                    // console.log(save);
                    return res.status(save.status).json(save)
                }
                // else {
                } else{
                 return res.status(400).json({message:"Invalid OTP"})

            }
            
            // console.log(req.app.locals);
            
            
        } catch (error) {
        console.log(error);
                    
        }
    } 
    async updateProfile(req:Request,res:Response){
        try {
            const body = req.body
            const update = await this.tenantCase.update(body)
        } catch (error) {
            console.log(error);
            
        }
    }
    async updatePassword(req:Request,res:Response){
        try {
            
            const {email,currentPassword,newPassword,repeatPassword} = req.body.data
            
            const update = await this.tenantCase.updatePassword(email,currentPassword,newPassword,repeatPassword) 
            if(update){

                res.status(200).json()
            }else{
                res.status(401).json()
            }
        } catch (error) {
           console.log(error);
            
        }
    }
    
async saveAdmin(req:Request,res:Response){
try {
    
    const {TenantId,id,password,repeatPassword} = req.body
   
    const response = await this.tenantCase.saveAdmin(TenantId,id,password,repeatPassword)
if(response){
    return res.status(200).json()
}   else{
    return res.status(401).json()
}


} catch (error) {
    
}
}

async getAdminList(req:Request,res:Response){
    try {
        const id = req.body.id as unknown as string
        const data = await this.tenantCase.adminList(id)

    } catch (error) {
        console.log(error);
        
    }
}

async createDb(req:Request,res:Response){
try {
    const id = req.body.id as unknown as string
    const data = await this.tenantCase.createDb(id)
} catch (error) {
    
}
}
async resendOtp(req:Request,res:Response){
    try { 
        const tenantData:ITenants = req.app.locals.tenant
           const  tenant = await this.tenantCase.resendOtp(tenantData)
           if(tenant){
            req.app.locals.otp = tenant.data.otp
           return  res.status(tenant.status).json({message:true})
           }
    
    } catch (error) {
        console.log(error);
        
    }
}
}


export default tenantController 