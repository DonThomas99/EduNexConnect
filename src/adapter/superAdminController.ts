import { Request, Response } from "express"
import superAdminUsecase from "../use_case/superAdminUseCase"
import { IbannerData } from "../domain/banner";

class superAdminController {
    private superAdminCase:superAdminUsecase
    constructor(
        superAdminCase:superAdminUsecase,
              ){
        this.superAdminCase= superAdminCase
        
    }
async adminLogin(req:Request,res:Response){
    console.log(req.body);
    
    const admin:any = await this.superAdminCase.adminLogin(req.body.email,req.body.password)  
    // if(admin.status){
        res.status(admin.status).json(admin)
        
    // }
}



async tenantList(req:Request,res:Response){
    const list:any = await this.superAdminCase.findAll()
    res.status(list.status).json(list)
}


async blockUnblock(req:Request,res:Response){
    try {
        
        const id = req.body.id as string
        const tenantStatus = await this.superAdminCase.blockUnblock(id)
        res.status(200).json(tenantStatus)
    } catch (error) {
        console.log(error);
        
    }
}

async getTenantData(req:Request,res:Response){
    try {     
        const id = req.params.TenantId as unknown as string
        const tenantData = await this.superAdminCase.findById(id)
        if(tenantData){           
            res.status(200).json(tenantData)
        }
    } catch (error) {
        res.status(500).json({message:'Error Fetching data'})
    }
}

//--------------Subscription Plans CRUD Operations----------------
async addPlan(req:Request,res:Response){
    try {     
        const value = req.body.planData
    const response = await this.superAdminCase.savePlan(value)
    if(response){
        res.status(response.status).json({message:response.message})
    }
    
    } catch (error) {
        res.status(500).json({message:'Error adding New Plan'})
        console.log(error);
        
    }
}


async fetchPlans(req:Request,res:Response){
try {
    const response = await this.superAdminCase.fetchPlans()
    if(response){
        res.status(response.status).json({message:response.message,data:response.data})
    }
} catch (error) {
console.log(error);
res.status(500).json({message:'No Plans Added Yet.'})
}
}

//--------------------Banner CRUD operations--------------

async addBanner(req:Request,res:Response){
    try {
        let bannerData:IbannerData
         bannerData = req.body.bannerData
        const response = await this.superAdminCase.saveBanner(bannerData)
        if(response){
            res.status(response.status).json({message:response.message})
        }
    } catch (error) {
        res.status(500).json({message:'Error Saving Banner'})
    }
}

async fetchBanner(req:Request,res:Response){
    try {
        const response = await this.superAdminCase.fetchBanner()
        if(response){
            res.status(response.status).json({message:response.message,data:response.data})
        }
        
    } catch (error) {
        
    }
}

async deleteBanner(req:Request,res:Response){
    try {
        const bannerId = req.query.bannerId as unknown as string
        console.log(bannerId)
        const response = await this.superAdminCase.removeBanner(bannerId)
        if(response){
            res.status(response.status).json({message:response.message})
        }
    } catch (error) {
        res.status(500).json({message:'Error Deleting Banner'})
    }
}

}
export default superAdminController