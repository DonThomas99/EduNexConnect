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
    async addSubject(req:Request,res:Response){
        try {
            const {classNumber,subject,id}= req.body
            const result = await this.schoolAdminCase.addSubjects(classNumber,subject,id)                
            if(result)
            res.status(result.status).json(result.data)
        } catch (error) {
            console.log(error);
            
        }
    }

    async addTeacher(req:Request,res:Response){
        try {
                const {id,data} = req.body
                const response = await this.schoolAdminCase.addTeacher(data,id)
                // return res.status(response.status)
        } catch (error) {
            console.log(error);
            
        }
    }
    async fetchClasses(req:Request,res:Response){
        try {
            const id = req.body.id as unknown as string
            const response = await this.schoolAdminCase.fetchClasses(id)
            if(response){

                res.status(response.status).json(response.data)
            }
        } catch (error) {
            console.log(error);
            
        }
    }

}

export default schoolAdminController