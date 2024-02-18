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
         console.log('body:',req.body);
                    const {name,password,id} = req.body
                    const result = await this.schoolAdminCase.login(name,password,id)
                    if(result){
                        console.log('hdsd');
                        
                        return res.status(result.status).json(result.data)
                    }
        } catch (error) {
            console.log(error);
            
        }
    }

}

export default schoolAdminController