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
            return {
                status:500,
                message:'Internal Error Try Again Later!!!'
            }
        }
    }
}