import teacherUseCase from "../use_case/teacherUseCase";
import { Request,Response } from "express";
class teacherController{
private teacherCase:teacherUseCase
constructor(
    teacherCase:teacherUseCase
){
this.teacherCase = teacherCase
}
async login(req:Request,res:Response){
    try {
        const {email,password,id} = req.body
        const status = await this.teacherCase.login(id,email,password)
        if(status){

            res.status(status.status).json(status.message)
        }
        
    } catch (error) {
res.status(500).json({message:'Error Please try after sometime'})
    }
}

async fetchTeacherData(req:Request,res:Response){
    try {
        const {id,email} = req.body
        const status = await this.teacherCase.fetchData(id,email)
        res.status(status.status).json(status.data)
    } catch (error) {
        res.status(500).json({message:'Error Please try after sometime'})
        
    }
}
//Material CRUD operations 
async uploadMaterial(req:Request,res:Response){
    try {
        // console.log('gdbdf:',req.body);
        const {subjectId,id} = req.body
        const{content,materialTitle,pdf} = req.body.data
        const response = await this.teacherCase.uploadMaterial(subjectId,id,materialTitle,pdf,content)
        // res.status()
    } catch (error) {
        console.log(error);
           }
}

async updateMaterial(req:Request,res:Response){
    try {
        console.log(req.body);
        
        // const response = a
    } catch (error) {
        console.log(error);
        
    }
}


}
export default teacherController