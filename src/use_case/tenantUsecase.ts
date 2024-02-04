// import tenant from "../domain/tenants";
import { ITenants } from "../domain/tenants";
// import tempTenantRepository from "../infrastructure/repository/tempTenantRepository";
import tenantRepository from "../infrastructure/repository/tenantRepository"
import otpGen from "../infrastructure/utils/otpGen";
import sendMail from "../infrastructure/utils/sendMail";
import hashPassword from "../infrastructure/utils/hashPassword"
import JwtCreate from "../infrastructure/utils/jwtCreate";

class tenantUsecase{
    // private tempTenantRepository: tempTenantRepository
    private tenantRepository: tenantRepository
    private otpGen:otpGen;
    private sendMail:sendMail;
    private hashPassword:hashPassword;
    private JwtCreate:JwtCreate;
    
    constructor(
        // tempTenantRepository: tempTenantRepository,
        tenantRepository:tenantRepository,
        sendMail:sendMail,
        otpGen:otpGen,
        hashPassword:hashPassword,
        JwtCreate:JwtCreate
    ){
        // this.tempTenantRepository = tempTenantRepository
        this.tenantRepository = tenantRepository
        this.sendMail = sendMail
        this.otpGen = otpGen
        this.hashPassword = hashPassword
        this.JwtCreate = JwtCreate
    }
  async signup(tenant:ITenants){
      const isExisting = await this.tenantRepository.findByEmail(tenant.email)
        console.log('in signup usecase');
        
        console.log(isExisting, 'isExisting');
        
        if(isExisting){
            return {
                status:200,
                data:{data:true}
            }
        } else {
            // const tenantData:any= await this.tenantRepository.save(tenant)
            const otp = await this.otpGen.genOtp(4)
            console.log(otp, 'otp')
            this.sendMail.sendMail(tenant.name,tenant.email,otp);
            return {
                status:200,
                data:{data:false,
                    otp:otp
                }
            }
        }
    }

async signIn(email:string,password:string) {
    try {
        
        const emailDb = await this.tenantRepository.findByEmail(email)
        
        if(emailDb){
            const passwordMatch = await this.hashPassword.compare(password,emailDb.password)
            console.log(passwordMatch);
            
            if(passwordMatch){
                console.log(passwordMatch);
                
            //    const email:s =  emailDb
                const jwt =  this.JwtCreate.createJwt(emailDb._id as unknown as string)

                return{
                    status: 200,
                    data:{jwt,emailDb}
                }
            }
            else{
                return{
                    status:401,
                    data:null,
                    message:'Invalid Password'
                }
            }
        }else{
            return{
                status:400,
                data:null,
                message:'User Not Found'
            }
        }
    } catch (error) {
        console.log((error as Error).message)
        return {
            status: 500,
            data:null,
            message:'Internal Server Error'
        }
    }


    }
    async tenantSave(tenant:ITenants){

        try {
            
            const passwordHash = await this.hashPassword.createHash(tenant.password)
            if(passwordHash){
                tenant.password = passwordHash
                const tenantData = await this.tenantRepository.save(tenant)
                return {
                    status : 200,
                    data:tenantData
                } 
            }
        } catch (error) {
            console.log((error as Error).message)
            return {
                status: 500,
                data:null,
                message:'Internal Server Error '
            }
        }

    }

async update(tenant:ITenants){
    try {    const id = tenant._id as unknown as string
            const data = await this.tenantRepository.updateProfile(id,tenant)
            return {
                status:200,
                data:data
            }
    } catch (error) {
        
    }
}

async updatePassword(email:string,existingPassword:any,newPassword:string,confirmPassword:string){
try { 
        console.log('In the usecase of update password');
        
        const data = await this.tenantRepository.findByEmail(email)
        if(data){
                console.log('going to update password');
                
            const status = await this.hashPassword.compare(existingPassword,data.password)   
            console.log("status:",status);
            if(status){
            const hashedPassword = await this.hashPassword.createHash(newPassword)
            console.log("hashedPassword:",hashedPassword);

            if(hashedPassword){
                const id = data._id as unknown as string 
                console.log('id tfytf8',id);
                
                const status2 = await this.tenantRepository.updatePassword(id,hashedPassword)
                    if(status2){
                        return true
                    }     else{
                        return false
                    }           
            }
            }     
        }
} catch (error) {
    console.log(error);
    
}
}



}
export default tenantUsecase