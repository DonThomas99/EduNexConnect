
import SuperAdminRepository from "../../use_case/interface/superAdminRepository"
import superAdmin from "../../domain/superAdmin";
import { getSchema } from "../utils/switchDb";
import { subscripitonPlan } from "../../domain/subscriptionPlan";

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


}

export default superAdminRepository