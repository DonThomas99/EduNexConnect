import { Request, Response } from "express"
import superAdminUsecase from "../use_case/superAdminUseCase"
import tenantUsecase from "../use_case/tenantUsecase"
class superAdminController {
    private superAdminCase:superAdminUsecase
    
    constructor(
        superAdminCase:superAdminUsecase       ){
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
}
export default superAdminController