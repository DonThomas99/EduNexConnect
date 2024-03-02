import mongoose from "mongoose";
import teacherRepository from "../../use_case/interface/teacherRepo";
import { getSchema } from "../utils/switchDb";

export default class teacherRepo implements teacherRepository{
 
    private getSchema =getSchema
    constructor(){

    }

async login(id:string,email:string){
    try {
        const Model = await this.getSchema(id,'teachers')
        const teacherData = await Model.findOne({email:email})
        return teacherData
        
    } catch (error) {
        console.log(error);
        
    }
}

async fetchData(id:string,email:string){
    try {
        const Model = await this.getSchema(id,'teachers')
        const teacherData = await Model.findOne({email:email})
        return teacherData
    } catch (error) {
       console.log(error);
        
    }
}

}