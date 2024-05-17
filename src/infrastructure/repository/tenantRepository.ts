// import tenant from "../../domain/tenants";
import TenantModel from "../database/tenantModel"
import TenantRepository from "../../use_case/interface/tenantRepository";
// import { ITempTenants } from "../../domain/tempTeants";
import { ITenants } from "../../domain/tenants";
import { UpdateResult } from "mongodb";
import { getSchema } from "../utils/switchDb";
import { ItenantPlan } from "../../domain/subscriptionPlan";

class tenantRepository implements TenantRepository{
    private readonly getSchema: (schoolName: string, modelName: string) => Promise<any>;

    constructor(getSchema: (schoolName: string, modelName: string) => Promise<any>) {
        this.getSchema = getSchema;
    }
   
     async save(tenant: ITenants) {
    const newTenant = new TenantModel(tenant)   
    await newTenant.save()
    return newTenant 
    }

    async findByEmail(email:string): Promise<ITenants | null>{
        console.log(email, 'email from repository');
        const TenantModel = await this.getSchema("EduNextConnect","tenants")
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
        const TenantModel = await getSchema("EduNextConnect","tenants")

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
    const schoolModel = await getSchema(id,"schoolAdmin")

    const Data = await schoolModel.find()
    if(Data){
        return Data
    }
} catch (error) {
    console.log(error);
    
}
    }

    //---------------------------Tenant Profile Management---------------------

    async updateProfile(id:string,tenant:ITenants){
        const TenantModel = await getSchema(id,"admins")
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
        const TenantModel = await this.getSchema(tenantId,"schoolAdmin")

        const data = await TenantModel.find({})
        // const schoolAdminsArray = (data[0]?.schoolAdmins ||[]) as {adminId:string,password:string}[];
        console.log("datqat:",data[0].adminId);
        
        for(const doc of data){
            
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
            const schoolAdminmodel = await getSchema(tenantId,"schoolAdmin")
            const newAdmin = new schoolAdminmodel(adminData); // Create a new instance of the CompanySchema with the provided data
            const updatedTenant = await newAdmin.save();
                console.log(updatedTenant);
                
            if(updatedTenant){
                        return true
        } else {
                return false;  
            }
        } catch (error) {
            console.log(error);
            
        }
    }


    //------------------------Subscription Operations---------------------------


    async fetchPlans(){
        try {
            const plansModel = await getSchema("EduNextConnect","subscriptionPlans")
            const plans = await plansModel.find({})
            if (plans.length>0){
                return plans
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            return null         
        }
    }

    async saveSubscriptionDetail(tenantPlan: ItenantPlan) {
        try {
            const { plan, tenantId, date } = tenantPlan;
            
            const mappedPlan = {
                amount: plan.amount,
                planName: plan.planName,
                durationUnit: plan.durationUnit,
                durationValue: plan.durationValue,
                expiryDate: new Date() // Initialize expiryDate as null initially
            };
    
            // Calculate expiry date based on durationValue and durationUnit
            const startDate = new Date(date);
            switch (mappedPlan.durationUnit.toLowerCase()) {
                case 'day':
                    mappedPlan.expiryDate = new Date(startDate.getTime() + (parseInt(mappedPlan.durationValue) * 24 * 60 * 60 * 1000));
                    break;
                case 'week':
                    mappedPlan.expiryDate = new Date(startDate.getTime() + (parseInt(mappedPlan.durationValue) * 7 * 24 * 60 * 60 * 1000));
                    break;
                case 'month':
                    mappedPlan.expiryDate = new Date(startDate.getFullYear(), startDate.getMonth() + parseInt(mappedPlan.durationValue), startDate.getDate());
                    break;
                case 'year':
                    mappedPlan.expiryDate = new Date(startDate.getFullYear() + parseInt(mappedPlan.durationValue), startDate.getMonth(), startDate.getDate());
                    break;
                default:
                    throw new Error('Invalid duration unit');
            }
    
            const premiumTenantModel = await getSchema("EduNextConnect", "premiumTenants");
            const newDocument = new premiumTenantModel({
               ...mappedPlan,
                tenantId,
                startedDate: startDate,
            });
    
            const save = await newDocument.save();
            console.log(save);
    
            if (!!save) {
                const tenantModel = await getSchema("EduNextConnect", "tenants");
                const tenant = await tenantModel.findById(tenantPlan.tenantId);
                const transaction = {
                    transactionType: tenantPlan.plan.planName,
                    amount: tenantPlan.plan.amount,
                    planId: tenantPlan.plan._id,
                    date: startDate,
                    expiryDate:mappedPlan.expiryDate
                };
                await tenant.transactions.push(transaction);
                const tenantStatus = await tenant.save();
                if (!!tenantStatus) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    

}
export default tenantRepository