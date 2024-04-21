import mongoose from "mongoose";
import teacherRepository from "../../use_case/interface/teacherRepo";
import { getSchema } from "../utils/switchDb";
import { IAssignment, Imaterial } from "../../domain/material";
import { ISubject } from "../../domain/subjectInterface";
import { SubjectName } from "../../domain/subjectInterface";

export default class teacherRepo implements teacherRepository{
    // private Subject:Subject
    private getSchema =getSchema
    constructor(
        
    ){

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

async fetchStudents(id:string,classNum:string){
    try {
        const Model = await this.getSchema(id,'students')
        const studentData = await Model.find({classNum:classNum})
        return studentData
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

async fetchMaterials(subjectId:string,id:string){
    try {
        const Model = await this.getSchema(id,'materials')
        const data = await Model.find({subjectId:subjectId})
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

async fetchAssignments(subjectId:string,id:string){
    try {
        const Model = await this.getSchema(id,'assignments')
        const data = await Model.find({subjectId:subjectId})
            return data
    } catch (error) {
        console.log(error);
        
    }
}

async fetchSubmissions(email:string,assignmentId:string,id:string){
    try {
        const Model = await  getSchema(id,'submissions')
        const url = await Model.find({studentEmail:email,assignmentId:assignmentId}).select('file_url')
        if(url.length>0){
            
            return url
        }else{
            return null
        }         
    } catch (error) {
        console.log(error);
        
    }
}

async deleteAssignment(id:string,assignmentId:string){
    try {
        const Model = await getSchema(id,'assignments')
        const status = await Model.deleteOne({"assignmentId":assignmentId})
        if(status.acknowledged){
            return true
        }else{
            return false
        }
        
    } catch (error) {
        console.log(error);
    }
}

async addGrade(id:string,assignmentId:string,studentEmail:string,grade:string){
    try {
        const Model = await getSchema(id,'submissions')
        const status = await Model.findOneAndUpdate(
            { assignmentId: assignmentId, studentEmail: studentEmail }, 
            {$set:{grade:grade}},
            {new:true}
        )
        if(!!status){
            return true
        } else{
            return false
        }
                
    } catch (error) {
        console.log(error);
        
    }
}

//---------------Online Class ---------------------------

async startClass(id: string, subjectId: string, classNum: string, roomId: string) {
    try {
        const Model = await this.getSchema(id, 'subjects');
        
        const updatedDoc = await Model.findOneAndUpdate(
            { 
                class: classNum, 
                "subjects._id": subjectId 
            },
            { 
                $set: { "subjects.$.roomId": roomId } 
            },
            { 
                new: true 
            }
        );

        if (!updatedDoc) {
            console.log('Document not found or subjectId does not exist in the subjects array');
            return false;
        }
        return true
        console.log('RoomId updated successfully:', updatedDoc);        
    } catch (error) {
        console.error(error);
    }
}

async endClass(id:string,subjectId:string,classNum:string){
    try {
        const Model = await this.getSchema(id, 'subjects');
        
        const updatedDoc = await Model.findOneAndUpdate(
            { 
                class: classNum, 
                "subjects._id": subjectId 
            },
            { 
                $set: { "subjects.$.roomId": null } 
            },
            { 
                new: true 
            }
        );

        if (!updatedDoc) {
            console.log('Document not found or subjectId does not exist in the subjects array');
            return false;
        }
        return true

    } catch (error) {
        console.log(error);
        
    }
}

}