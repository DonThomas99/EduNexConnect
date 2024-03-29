import { Request,Response } from "express";
import studentUseCase from "../use_case/studentUseCase";

export default class studentController{
    private studentCase:studentUseCase
    constructor(
        studentCase:studentUseCase,

        ){
            this.studentCase = studentCase
    }

    async login (req:Request, res:Response){
        try {
            const {email,password,id} = req.body        
            const response = await this.studentCase.login(email,password,id)
            res.status(response.status).json(response.message)
        } catch (error) {
            console.log(error);
            
            return {
                status:500,
                message:'Internal Error Try Again Later!!!'
            }
        }
    }

    async fetchStudentData (req:Request, res:Response){
        try {
            const {email,id} = req.body
const response = await this.studentCase.fetchStudentData(email,id)
res.status(response.status).json({data:response.data,message:response.message})
         } catch (error) {
    console.log(error);
                res.status(500).json({data:null,message:'Error fetching Data'})
        }
    }

    async fetchSubjects(req:Request,res:Response){
        try {
    const {id,email,classNum} = req.body
    const response = await this.studentCase.fetchSubjects(classNum,id)    
    res.status(response.status).json(response.data)      
        } catch (error) {
            console.log(error);
            res.status(500).json({data:null,message:'Error Fetching Subjects'})
            
        }
    }

    async fetchAsnmtMat(req:Request,res:Response){
        try {
                console.log(req.body);
                const{subjectId,id} = req.body
                            const response = await this.studentCase.fetchAsnmtMat(subjectId,id)
                            if(response){

                                res.status(response.status).json(response.data)
                            }else{
res.status(409).json({message:'Error fetching Data'})
                            }
        } catch (error) {
            console.log(error);
            
        }
    }
}