import schoolAdminRepository from "../../use_case/interface/schoolAdminRepo";
import { getSchema,switchDB } from "../utils/switchDb";
import Subject from "../../domain/subjectInterface";
import { Error as  MongooseError } from "mongoose";

export default class schoolAdminRepo implements schoolAdminRepository {
    async findById(id:string,name:string){
        console.log('came here');
        
        const Model = await getSchema(id,'schoolAdmin')
        console.log('Model:',Model);
        
        const document = await Model.findOne({adminId:name})
        return document 
        
    }
    async subjectExists(subject:string,classNumber:string,id:string){
        const Model = await getSchema(id,'subjects')
        const status = await Model.findOne({
            class:classNumber,
            'subjects.name':subject})
        return !!status
    }
    async addSubject(classNumber: string,subject:string, document: Subject, id: string): Promise<boolean> {
        try {
            const Model = await getSchema(id, 'subjects');
            const status = await Model.findOne({ class: classNumber });
            
            if (status) {
                status.subjects.push(document.subjects[0])
                await status.save()
                return true; // Return false indicating subject already exists
            } else {
                // Insert the subject if it doesn't already exist
                await Model.create(document);
                return true; // Return true if insertion is successful
            }
        } catch (error) {
            console.error('Error inserting document:', error);
            return false; // Return false if an error occurs
        }
    }

    async fetchClasses(id:string){
        try {
            const Model = await getSchema(id,'subjects')
            const data = Model.find({})
            return data
        } catch (error) {
            console.log(error);
            
        }
    }
    
}