import tenant from "../../domain/tenants";
import TenantModel from "../database/tenantModel"
import TenantRepository from "../../use_case/interface/tenantRepository";

class tenantRepository implements TenantRepository{
    async save(tenant:tenant){
        const newTenant = new TenantModel(tenant)
        await newTenant.save()
        return newTenant
    }
    async findByEmail(email:string){
        const extistingUser = await TenantModel.findOne({email})
        if(extistingUser){
            return extistingUser
        }
        else{
            return null
        }
    }
}
export default tenantRepository