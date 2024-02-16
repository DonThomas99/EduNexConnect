import schoolAdminUseCase from "../use_case/schoolAdminUseCase"
import { Request,Response } from "express"

class schoolAdminController{
    private schoolAdminCase: schoolAdminUseCase
    constructor(
        schoolAdminCase:schoolAdminUseCase
    ){
this.schoolAdminCase = schoolAdminCase
    }

    async schoolAdminLogin(req:Request,res:Response){
        try {
            console.log("I'm here:",req.body);
            
        } catch (error) {
            
        }
    }

}

export default schoolAdminController