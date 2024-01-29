// import tenant from "../../domain/tenants";
import TenantModel from "../database/tenantModel"
import TenantRepository from "../../use_case/interface/tenantRepository";
// import { ITempTenants } from "../../domain/tempTeants";
import { ITenants } from "../../domain/tenants";

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
}
export default tenantRepository