// import tenant from "../domain/tenants";
import { ITenants } from "../domain/tenants";
// import tempTenantRepository from "../infrastructure/repository/tempTenantRepository";
import tenantRepository from "../infrastructure/repository/tenantRepository"
import otpGen from "../infrastructure/utils/otpGen";
import sendMail from "../infrastructure/utils/sendMail";
import hashPassword from "../infrastructure/utils/hashPassword"
import JwtCreate from "../infrastructure/utils/jwtCreate";
import { ItenantPlan, OsubscripitonPlan } from "../domain/subscriptionPlan";
import generateStripeSession from "../infrastructure/utils/stripeSubscription";
import { Request } from "express";

class tenantUsecase {
    // private tempTenantRepository: tempTenantRepository
    private tenantRepository: tenantRepository
    private otpGen: otpGen;
    private sendMail: sendMail;
    private hashPassword: hashPassword;
    private JwtCreate: JwtCreate;
    private stripeSession:generateStripeSession

    constructor(
        // tempTenantRepository: tempTenantRepository,
        tenantRepository: tenantRepository,
        sendMail: sendMail,
        otpGen: otpGen,
        hashPassword: hashPassword,
        JwtCreate: JwtCreate,
        stripeSession:generateStripeSession
    ) {
        // this.tempTenantRepository = tempTenantRepository
        this.tenantRepository = tenantRepository
        this.sendMail = sendMail
        this.otpGen = otpGen
        this.hashPassword = hashPassword
        this.JwtCreate = JwtCreate
        this.stripeSession = stripeSession
    }
    async signup(tenant: ITenants) {
        const isExisting = await this.tenantRepository.findByEmail(tenant.email)
        console.log('in signup usecase');

        console.log(isExisting, 'isExisting');

        if (isExisting) {
            return {
                status: 200,
                data: { data: true }
            }
        } else {
            // const tenantData:any= await this.tenantRepository.save(tenant)
            const otp = await this.otpGen.genOtp(4)
            console.log(otp, 'otp')
            this.sendMail.sendMail(tenant.name, tenant.email, otp);
            return {
                status: 200,
                data: {
                    data: false,
                    otp: otp
                }
            }
        }
    }

    async signIn(email: string, password: string) {
        try {
            const emailDb = await this.tenantRepository.findByEmail(email);

            if (emailDb) {
                const passwordMatch = await this.hashPassword.compare(password, emailDb.password);
                if (passwordMatch) {
                    // Generate tokens
                    const accessToken = this.JwtCreate.createJwt(emailDb._id as unknown as string);
                    const refreshToken = this.JwtCreate.generateRefreshToken(emailDb._id as unknown as string); // Implement your refresh token generation logic here

                    // Set the refresh token in the user object (for future use)
                    // await this.tenantRepository.setRefreshToken(emailDb._id as unknown as  string, refreshToken);
                    console.log('access:', accessToken);
                    console.log('refresg:', refreshToken);



                    // Send the tokens in the response
                    return {
                        status: 200,
                        data: {
                            accessToken,
                            refreshToken,
                            emailDb
                        }
                    };
                } else {
                    return {
                        status: 401,
                        data: null

                    };
                }
            } else {
                return {
                    status: 400,
                    data: null,
                    message: 'User Not Found'
                };
            }
        } catch (error) {
            console.log((error as Error).message);
            return {
                status: 500,
                data: null,
                message: 'Internal Server Error'
            };
        }
    }

    async tenantSave(tenant: ITenants) {

        try {

            const passwordHash = await this.hashPassword.createHash(tenant.password)
            if (passwordHash) {
                tenant.password = passwordHash
                const tenantData = await this.tenantRepository.save(tenant)
                return {
                    status: 200,
                    data: tenantData
                }
            }
        } catch (error) {
            console.log((error as Error).message)
            return {
                status: 500,
                data: null,
                message: 'Internal Server Error '
            }
        }

    }

    async update(tenant: ITenants) {
        try {
            const id = tenant._id as unknown as string
            const data = await this.tenantRepository.updateProfile(id, tenant)
            return {
                status: 200,
                data: data
            }
        } catch (error) {

        }
    }

    async updatePassword(email: string, currentPassword: any, newPassword: string, repeatPassword: string) {
        try {

            const data = await this.tenantRepository.findByEmail(email)
            if (data) {

                const status = await this.hashPassword.compare(currentPassword, data.password)
                if (status) {
                    const hashedPassword = await this.hashPassword.createHash(newPassword)

                    if (hashedPassword) {
                        const id = data._id as unknown as string

                        const status2 = await this.tenantRepository.updatePassword(id, hashedPassword)
                        if (status2) {
                            return true
                        } else {
                            return false
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);

        }
    }
    async saveAdmin(tenantId: string, id: string, password: string, repeatPassword: string) {
        try {


            const isExists = await this.tenantRepository.adminExist(tenantId, id)

            console.log("is exist:", isExists);

            if (!isExists) {

                const add = await this.tenantRepository.AdminSave(tenantId, id, password)
                return add
            } else {
                return false
            }

        } catch (error) {

        }     
    }

    async adminList(id: string) {
        try {
            const data = await this.tenantRepository.findById(id)
            return {status:200,
                data:data
        } 
    }
    catch (error) {

        }
    }

    async createDb(id: string) {
        try {

        } catch (error) {

        }
    }

    async resendOtp(tenant: ITenants) {
        try {
            const otp = await this.otpGen.genOtp(4)
            console.log(otp, 'otp')
            this.sendMail.sendMail(tenant.name, tenant.email, otp);
            return {
                status: 200,
                data: {
                    data: false,
                    otp: otp
                }
            }
        } catch (error) {
            console.log(error);

        }
    }
    
async fetchPlans(){
    try {
        const plans = await this.tenantRepository.fetchPlans()
        if(plans){
            return{
                status:200,
                data:plans
            }
        } else{
            return {
                status:304,
                data:null,
            }
        }
    } catch (error) {
        console.log(error);
            return {
                status:500,
                message:'Error Fetching Plans'
            }        
    }
}

async subscribePlan(ItenantPlan:ItenantPlan){
    try {
        
        
       const sessionUrl  = await this.stripeSession.confirmTransaction(ItenantPlan)
       if(sessionUrl){
        return {
            status:200,
            url:sessionUrl
        }
       } else{
        return {
            status:409,
            message:'Error Fetching Url'
        }
       }
       
        
    } catch (error) {
        console.log(error);
        return {
            status:500,
            message:"Error Subscribing "
        }
        
    }
}
async confirmSubscription(ItenantPlan:ItenantPlan){
    try {
        const saveSubscription = await this.tenantRepository.saveSubscriptionDetail(ItenantPlan)
        if(saveSubscription){
                return {
                    status:200,
                    message:'Payment Successfull'
                }
        }
        
    } catch (error) {
        console.log(error);
        return {
            status:500,
            
        }
        
    }
}


}
export default tenantUsecase