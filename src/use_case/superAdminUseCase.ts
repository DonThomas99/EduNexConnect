import { IbannerData } from "../domain/banner";
import { subscripitonPlan } from "../domain/subscriptionPlan";
import superAdminRepository from "../infrastructure/repository/superAdminRepository";
import tenantRepository from "../infrastructure/repository/tenantRepository";
import JwtCreate from "../infrastructure/utils/jwtCreate";
class superAdminUsecase {
constructor(
    private readonly superAdminRepository:superAdminRepository,
    private readonly tenantRepository:tenantRepository,
    private JwtCreate : JwtCreate
){

}
    async adminLogin(email:string,password:string){
        try {
           
            
            const admin = await this.superAdminRepository.findByEmail(email)
            if(admin){
                if(password === admin.password){
                    const jwt = this.JwtCreate.createJwt(admin._id as unknown as string )
                    return {
                        status:200,
                        data:{jwt,admin}
                    }
                }else{
                    return {
                        status:401,
                        data:null,
                        message:'Invalid Password'
                    }
                }
            }else{
                return {
                    status:400,
                    data:null,
                    message:'Admin Not Found'
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

async findAll(){
    try {
        const arr = await this.tenantRepository.findAll()
        // if(arr.length){
        const length = arr.length   
        return {
                status : 200,
                data:{arr,length}
                
            }
        
    } catch (error) {
        
    }
}


async blockUnblock(id:string){
    try {
        const tenantStatus = await this.tenantRepository.blockUnblock(id)
        
    } catch (error) {
        
    }

 }

 async findById(id:string){
try {
    const Data = await this.tenantRepository.findById(id)
    if(Data){
        return {
            status:200,
            data:Data
        }
    } else{
        return {
            status:404
        }
    }
} catch (error) {
    console.log(error);
    
}
 }

 //--------------Subscription Plans CRUD Operations----------------

 async savePlan(newPlan:subscripitonPlan){
    try {
        const savePlan = await this.superAdminRepository.addPlan(newPlan)
        console.log(savePlan,'heeiei')
        if(savePlan){
            return{
                status:200,
                message:'Plan Added Successfully'
            }
        }else {
            return{
                status:409,
                message:'Error Adding Plan'
            }
        }
    } catch (error) {
        console.log(error);
        return {
            status:500,
            message:'Internal Server Error'
        }
        
    }

 }
 async fetchPlans(){
    try {
        const plans = await this.superAdminRepository.fetchPlans()
        if(plans){
            return{
                status:200,
                data:plans
            }
        } else{
            return {
                status:304,
                data:null,
                message:"No Plans Added Yet"
            }
        }
    } catch (error) {
        console.log(error);
        return {
            status:500,
            message:"Error Fetching Plans"
        }
        
    }
 }

 //------------------------Banner CRUD Operations----------------------------

 async fetchBanner(){
    try {
        const banners = await this.superAdminRepository.fetchBanner()
        if(banners){
            return {
                status:200,
                data:banners
            }
        }else{
            return {
                status:409,
                data:null,
                message:'No Banners Added Yet'
            }
        }
    } catch (error) {
        console.log(error)
        return {
            status:500,
            message:"Error Fetching Plans"
        }
    }
 }

 async saveBanner(bannerData:IbannerData){
   try {
        const saveBanner = await this.superAdminRepository.saveBanner(bannerData)
        if(saveBanner){
            return {
                status:200,
                message:'Banner Added Successfully'
            }
        }else{
            return {
                status:409,
                message:'Error Saving Banner '
            }
        }
   } catch (error) {
    return {
        status:500,
        message:'Error Saving Banner'
    }
   } 
 }

 async removeBanner(bannerId:string){
    try {
        const removeBanner = await this.superAdminRepository.deleteBanner(bannerId)
        if(removeBanner){
            return{
                status:200,
                message:'Banner Deleted Successfully'
            }
        }else{
            return {
                status:409,
                message:'Error Deleting Banner'
            }
        }
    } catch (error) {
        return{
            status:500,
            message:'Error Removing Banner'
        }
    }
 }

}
export default  superAdminUsecase