import { Request, Response } from "express"
import superAdminUsecase from "../use_case/superAdminUseCase"
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
    try {     console.log('ghee');
       
        const id = req.params.TenantId as unknown as string
        const tenantData = await this.superAdminCase.findById(id)
        if(tenantData){
            console.log(tenantData);
            
            res.status(200).json(tenantData)
        }
    } catch (error) {
        
    }
}

}
export default superAdminController