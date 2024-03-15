import mongoose from "mongoose";
import teacherRepository from "../../use_case/interface/teacherRepo";
import { getSchema } from "../utils/switchDb";
import { IAssignment, Imaterial } from "../../domain/material";

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
//-------------Materials CRUD operations-------------------
async uploadMaterial(document:Imaterial,id:string){
    try { console.log('herr');
    
        const Model = await this.getSchema(id,'materials')
        const upload = await Model.create(document)
        return upload                
    } catch (error) {
        console.log(error);
    }
}

async fetchMaterials(subjectId:string,teacherId:string,id:string){
    try {
        const Model = await this.getSchema(id,'materials')
        const data = await Model.find({subjectId:subjectId,teacherId:teacherId})
        return data

    } catch (error) {
        console.log(error);
        
    }
}

//-------------Assignment CRUD operations---------------

async uploadAssignment(id:string,document:IAssignment){
    try {
        const Model = await this.getSchema(id,'assignments')
        const upload = await Model.create(document)
        return upload
    } catch (error) {
        console.log(error);
        
    }
}

}