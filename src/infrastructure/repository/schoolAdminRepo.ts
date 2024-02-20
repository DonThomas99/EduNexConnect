import schoolAdminRepository from "../../use_case/interface/schoolAdminRepo";
import { getSchema,switchDB } from "../utils/switchDb";
import {Subject} from "../../domain/subjectInterface";
import { Error as  MongooseError } from "mongoose";
import { Iteachers, classNsub, teachers } from "../../domain/teachers";

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
                return true; 
            } else {
                
                await Model.create(document);
                return true; 
            }
        } catch (error) {
            console.error('Error inserting document:', error);
            return false; 
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
    async teacherExists(id:string,data:Iteachers){
        try {
            const Model = await getSchema(id, 'teachers');
            const teacher = await Model.findOne({ email:data.email });
            const stat= !!teacher;

            
            if(stat){
                                
                const existingClass = teacher.classNsub.find((c: classNsub) => c.classNum === data.class);
                console.log('bee',existingClass);
                
                if (existingClass) {

                    if (!existingClass.subject.includes(data.subject)) {
                        existingClass.subject.push(data.subject);
                    } 
                    
                }
                await teacher.save();
                return true
        }
        } catch (error) {
            
        }
    }


    async addTeachers(userId:string,password:string,data:Iteachers,id:string){
        try {
            const Model = await getSchema(id, 'teachers'); 
                const newTeacher: teachers = {
                    name: data.name,
                    email: data.email,
                    userId: userId,
                    password: password,
                    classNsub: [{ classNum: data.class, subject: [data.subject] }]
                }
                await Model.create(newTeacher);
    
            return true; 
        } catch (error) {
            console.error('Error saving or updating teacher:', error);
            return false; 
        }
    }
    
    
}