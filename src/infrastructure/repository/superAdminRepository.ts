
import SuperAdminRepository from "../../use_case/interface/superAdminRepository"
import superAdmin from "../../domain/superAdmin";
import { getSchema } from "../utils/switchDb";
import { subscripitonPlan } from "../../domain/subscriptionPlan";
import { IbannerData } from "../../domain/banner";

class superAdminRepository implements SuperAdminRepository{
    
    async findByEmail(email:string): Promise< superAdmin| null>{
        console.log(email, 'email from repository');
        const superAdminModel = await getSchema("EduNextConnect","admins")
        let check=await superAdminModel.find({})
        
        return await superAdminModel.findOne({email:email})
    }

    //-----------------Subscription Plans-------------

    async addPlan(planData:subscripitonPlan){
        try {
            const superAdminModel = await getSchema("EduNextConnect","subscriptionPlans")
            const newPlan = new superAdminModel(planData)
            const save = await newPlan.save()
            if(save){
                return true
            }else {
                return false 
            }
        } catch (error) {
            console.log(error);
            return false
            
        }
    }

    async fetchPlans(){
        try {
            const superAdminModel = await getSchema("EduNextConnect","subscriptionPlans")
            const plans = superAdminModel.find({})
            if(plans){
                return plans 
            }else{
                return null
            }
        } catch (error) {
            console.log(error);
            return null            
        }
    }

    //-----------------------------Banner CRUD Operations---------

    async saveBanner(bannerData:IbannerData){
        try {
            
            const superAdminModel = await getSchema("EduNextConnect","bannerSchema")
            const newBanner = new superAdminModel(bannerData)
            const save = await newBanner.save()
            if(save){
                      return true
            }else{
                return false
            }
        } catch (error) {
            return false
        }

    }

    async deleteBanner(bannerId:string){
        try {
            const superAdminModel = await getSchema("EduNextConnect","bannerSchema")
            const status = await superAdminModel.deleteOne({_id:bannerId})
            if(status){
                return true
            }else{
                return false
            }
            
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async fetchBanner(){
        try {
            const superAdminModel = await getSchema("EduNextConnect","bannerSchema")
            const data = await superAdminModel.find({})
            if(data){
                return data
            }else{
                return null
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default superAdminRepository