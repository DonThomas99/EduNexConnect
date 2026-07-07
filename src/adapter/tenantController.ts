import { Request,Response } from "express";
import tenantUsecase from "../use_case/tenantUsecase"
import GenerateStripeSession from "../infrastructure/utils/stripeSubscription";
import { setPendingSignup, getPendingSignup, clearPendingSignup } from "../infrastructure/utils/pendingSignups";
// import stripe from "stripe";
// import tenants from "../domain/tenants";


class tenantController {
    private tenantCase:tenantUsecase

    constructor(
        tenantCase:tenantUsecase        ){
        this.tenantCase= tenantCase
        
    }
    //---------------Tenant Authentication Operations--------------
        async signUp(req:Request,res:Response){
            try {     
                console.log(req.body);
                const tenantData = req.body.tenantData
                
                const tenant = await this.tenantCase.signup(tenantData)
                if(!tenant.data.data){
                    setPendingSignup(tenantData.email, tenantData, tenant.data.otp!)
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

            if(loginStatus.status === 200 && loginStatus.data){
                res.cookie('tenantJwt', loginStatus.data.accessToken, {
                    httpOnly:true,
                    secure:process.env.NODE_ENV === 'production',
                    sameSite:'lax',
                    maxAge:60*60*1000
                })
                res.status(200).json({status:200,data:{emailDb:loginStatus.data.emailDb}})
            } else{
                res.status(loginStatus.status).json(loginStatus)
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Error Signing In"})
        }
    }

    async signOut(req:Request,res:Response){
        try {
            res.clearCookie('tenantJwt')
            res.status(200).json({message:'Signed out'})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Error Signing Out"})
        }
    }

    async verifyOtp(req:Request,res:Response){
        try {
            const otpBody:string = req.body.otp
            const email:string = req.body.email
            const pending = getPendingSignup(email)
            if(!pending){
                return res.status(400).json({message:"Signup session expired, please sign up again"})
            }
            if (otpBody === pending.otp){
                const save  = await this.tenantCase.tenantSave(pending.tenant)
                clearPendingSignup(email)
                if(save){
                    return res.status(save.status).json(save)
                }
                return res.status(500).json({message:"Error Saving Tenant"})
                } else{
                 return res.status(400).json({message:"Invalid OTP"})

            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Error Verifying OTP"})
        }
    }

    //-------------Profile Management Operations------------------

    async updateProfile(req:Request,res:Response){
        try {
            const body = req.body
            const update = await this.tenantCase.update(body)
            if(update){
                res.status(update.status).json(update)
            } else{
                res.status(500).json({message:"Error Updating Profile"})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Error Updating Profile"})
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
           res.status(500).json({message:"Error Updating Password"})
        }
    }

    //--------------School Admin CRUD Operations------------------
    
async saveAdmin(req:Request,res:Response){
try {
    
    const {TenantId,id,password,repeatPassword} = req.body
   console.log('in admin:',id);
   
    const response = await this.tenantCase.saveAdmin(TenantId,id,password,repeatPassword)
if(response){
    return res.status(200).json()
}   else{
    return res.status(401).json()
}


} catch (error) {
    console.log(error);
    res.status(500).json({message:"Error Saving Admin"})
}
}

async getAdminList(req:Request,res:Response){
    try {
        const id = req.query.id as unknown as string
        const data = await this.tenantCase.adminList(id)
        console.log("list from repo:",data);

        return res.status(200).json(data)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error Fetching Admin List"})
    }
}

async createDb(req:Request,res:Response){
try {
    const id = req.body.id as unknown as string
    const data = await this.tenantCase.createDb(id)
    res.status(200).json({data})
} catch (error) {
    console.log(error);
    res.status(500).json({message:"Error Creating Database"})
}
}
async resendOtp(req:Request,res:Response){
    try {
        const email = req.query.email as string
        const pending = getPendingSignup(email)
        if(!pending){
            return res.status(400).json({message:"Signup session expired, please sign up again"})
        }
        const tenant = await this.tenantCase.resendOtp(pending.tenant)
        if(tenant){
            setPendingSignup(email, pending.tenant, tenant.data.otp!)
            return res.status(tenant.status).json({message:true})
        }
        res.status(500).json({message:"Error Resending OTP"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error Resending OTP"})
    }
}

//---------------Subscription Operations 

async fetchPlans(req:Request,res:Response){
    try {       
        const response = await this.tenantCase.fetchPlans()
        if(response){
            res.status(response.status).json({data:response.data,message:response.message})
        } else{
        res.status(500).json({message:'Error Fetching Plans'})           
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error Fetching Plans'})
        
    }
}

async subscribePlan(req:Request,res:Response){
    try {
        const {plan,tenantId,date} = req.body 
        const document ={
            plan:plan,
            tenantId:tenantId,
            date:date
        }

        const response = await this.tenantCase.subscribePlan(document)
        if(response){
            res.status(response.status).json({url:response.url,message:response.message})
        } else{
            res.status(500).json({message:"Error Subscribing"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error Subscribing"})

    }
}
async saveSubscription(req:Request,res:Response){
    try {
        const subscripiton = new GenerateStripeSession()
        const event = await subscripiton.confirmSubscription(req)
        if(!event.verified){
            res.status(400).json({message:"Webhook signature verification failed"})
            return
        }
        if(!event.subscription){
            console.log('Verified webhook carried no subscription metadata, ignoring')
            res.status(200).json({received:true})
            return
        }
        const response = await this.tenantCase.confirmSubscription(event.subscription)
        if(response){
            res.status(response.status).json({message:response.message})
        } else{
            res.status(200).json({received:true})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error confirming subscription"})
    }
}

}


export default tenantController 