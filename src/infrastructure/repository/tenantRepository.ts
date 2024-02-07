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
    
    async findById(id:string){
try {
    const Data = await TenantModel.findById(id)
    if(Data){
        return Data
    }
} catch (error) {
    console.log(error);
    
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
async adminExist(tenantId:string,id:string){
    try {
        const data = await TenantModel.find({_id:tenantId},{schoolAdmins:1})
        const schoolAdminsArray = (data[0]?.schoolAdmins ||[]) as {adminId:string,password:string}[];
        for(const doc of schoolAdminsArray){
            
            if(id === doc.adminId){
                return true
            }
        }
        return false
        
    } catch (error) {
        console.log(error);
        
    }
}


    async AdminSave(tenantId:string,id:string,password:string){
        const adminData ={
            adminId :id,
            password:password
        }
        try {
            
            const updatedTenant = await TenantModel.findByIdAndUpdate(
                tenantId,
                { $push: { schoolAdmins: adminData }},
                { new: true }
            );
                
            if(updatedTenant){
                        return true
        } else {
                return false;  
            }
        } catch (error) {
            console.log(error);
            
        }
    }


}
export default tenantRepository