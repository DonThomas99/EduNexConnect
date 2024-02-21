import schoolAdminRepository from "../../use_case/interface/schoolAdminRepo";
import { getSchema,switchDB } from "../utils/switchDb";
import {Subject} from "../../domain/subjectInterface";
import { Error as  MongooseError } from "mongoose";
import { Iteachers, classNsub, teachers, unAssignedTeacher } from "../../domain/teachers";

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
                return true           
                }else{
                    return false
                }
                

        } catch (error) {
            return false
        }
    }

    async teacherUnassigned(id:string,password:string,data:Iteachers){
        try {
            const Model = await getSchema(id, 'teachers');

            // Create a new teacher document without classNsub property
            const newTeacher: teachers = {
                name: data.name,
                email: data.email,
                password: password,  
                // classNsub :[{classNum:'',subject:['']}]
            };
    
            // Create and save the new teacher document
            await Model.create(newTeacher);
            return true
        } catch (error) {
            return false
        }
    }

    async existingClass(id:string,data:Iteachers){
        try {
            const Model = await getSchema(id, 'teachers');
            const teacher = await Model.findOne({ email: data.email });
    if(teacher){
                const existingClassIndex = teacher.classNsub.findIndex((c: classNsub) => c.classNum === data.class);
                if (existingClassIndex !== -1) {
                    const existingClass = teacher.classNsub[existingClassIndex]; 
                   return existingClass
                    //    if (!existingClass.subject.includes(data.subject)) {
                    //                 // Subject doesn't exist for the class, add it
                    //                 existingClass.subject.push(data.subject);
                    //                 await teacher.save();
                // }
                // else{
                //     return false
                // }


                }else {
                                    // Class doesn't exist, create new entry for class with the subject
                                    teacher.classNsub.push({ classNum: data.class, subject: [data.subject] });
                                    await teacher.save();
                                    return true; // New class and subject added successfully
        
    }
         
        } 
    }catch (error) {
            
        }
    

    }

async addToClass(id:string,data:Iteachers){
    try {
        const Model = await getSchema(id,'teachers')
        const teacher = await Model.findOne({email:data.email})
        if(teacher){
            const existingClassIndex = teacher.classNsub.findIndex((c:classNsub)=>c.classNum === data.class)
            if(existingClassIndex != -1){
                const result = await Model.updateOne(
                    { email: data.email, 'classNsub.classNum': data.class },
                    { $push: { 'classNsub.$.subject': data.subject } }
                );
                    if(result.modifiedCount >0){
                        return true
                    }else{
                        return false
                    }
                
            }
        }
    } catch (error) {
        return false
    }
}


    // async existingClass(id: string, data: Iteachers) {
    //     try {
    //        
    //         if (teacher) {
    
    //                 // Class exists
    
    //                 // Check if the subject is already assigned to another faculty in the same class
    //                 const isSubjectAssignedToAnotherFaculty = await Model.exists({
    //                     'classNsub.classNum': data.class,
    //                     'classNsub.subject': data.subject,
    //                     email: { $ne: data.email } // Exclude current teacher from the search
    //                 });
    
    //                 if (isSubjectAssignedToAnotherFaculty) {
    //                     return { success: false, status: 407, message: 'Subject already assigned to another faculty in the same class' }; // Conflict
    //                 }
    
    //              
    //                     return { success: true, status: 200 }; // Subject added successfully
    //                 } else {
    //                     // Subject already exists for the class
    //                     return { success: false, status: 409, message: 'Subject already exists for the class' }; // Conflict
    //                 }
    //             }
    //             }
    //         } else {
    //             // Teacher not found
    //             }
    //     } catch (error) {
    //         console.error('Error checking existing class:', error);
    //         return { success: false, status: 500, message: 'Internal Server Error' }; // Internal server error
    //     }
    // }

    async isSubjectAssignedToAnotherFaculty(id:string, data: Iteachers) {
        try {
            
            const Model = await getSchema(id, 'teachers');
           const isExist = await Model.exists({
                'classNsub.classNum': data.class,
                'classNsub.subject': data.subject,
                email: { $ne: data.email } // Exclude current teacher from the search
            });
            if(isExist){
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
        
    }
    


    async addTeachers(password:string,data:Iteachers,id:string){
        try {
            const Model = await getSchema(id, 'teachers'); 
                const newTeacher: teachers = {
                    name: data.name,
                    email: data.email,
                    
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