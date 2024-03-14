import mongoose from "mongoose";
import teacherRepository from "../../use_case/interface/teacherRepo";
import { getSchema } from "../utils/switchDb";
import { Imaterial } from "../../domain/material";

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

async uploadMaterial(document:Imaterial,id:string){
    try { console.log('herr');
    
        const Model = await this.getSchema(id,'materials')
        const upload = await Model.create(document)
        console.log('hee:',upload);
                
    } catch (error) {
        console.log(error);
        
    }
}

}