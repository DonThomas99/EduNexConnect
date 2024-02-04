// import tenant from "../../domain/tenants";
import TenantModel from "../database/tenantModel"
import TenantRepository from "../../use_case/interface/tenantRepository";
// import { ITempTenants } from "../../domain/tempTeants";
import { ITenants } from "../../domain/tenants";
import { UpdateResult } from "mongodb";

class tenantRepository implements TenantRepository{
   
     async save(tenant: ITenants) {
    const newTenant = new TenantModel(tenant)   
    await newTenant.save()
    return newTenant 
    }

    async findByEmail(email:string): Promise<ITenants | null>{
        console.log(email, 'email from repository');
        
        return await TenantModel.findOne({email:email})


        // console.log(extistingUser, 'extistingUser from repo');
        
        // if(extistingUser){
        //     return extistingUser
        // } else{
        //     return null
        // }
    }
    async findAll(){
        return await TenantModel.find({})
    }

    async blockUnblock(id:string):Promise<UpdateResult | null>{
        try {
            const tenant =  await TenantModel.findById(id)
            if(tenant){
                const newStatus = ! tenant.isBlocked;
                const tenantStatus = await TenantModel.updateOne(
                    {_id:id},{$set:{isBlocked:newStatus}}
                )
                return tenantStatus
            } else {
                return null
            }
        } catch (error) {
            return null
        } 
    } 
    async updateProfile(id:string,tenant:ITenants){
        const {name,mobile,email,school,address,state} = tenant
     const status = await TenantModel.findByIdAndUpdate({_id:id},{$set:{
        name,mobile,email,school,address,state
     }})
     return status
    }

    async updatePassword(id:string,password:string){
   const tenant = await TenantModel.findById(id)
        
   if(tenant){
     const tenantStatus = await TenantModel.updateOne({_id:id},{$set:{password}},{new:true})
       
    return tenantStatus
}
        
    }


}
export default tenantRepository