import schoolAdminRepository from "../../use_case/interface/schoolAdminRepo";
import { getSchema,switchDB } from "../utils/switchDb";
import {SubjectsDocument} from "../../domain/subjectInterface";
import mongoose, { Error as  MongooseError } from "mongoose";
import { Iteachers, classNsub, teachers, unAssignedTeacher } from "../../domain/teachers";
import { Istudent } from "../../domain/Student";

export default class schoolAdminRepo implements schoolAdminRepository {

    async findById(id:string,name:string){        
        const Model = await getSchema(id,'schoolAdmin')
                
        const document = await Model.findOne({adminId:name})
        return document 
        
    }

    async fetchStudentCount(id:string){
            try {
                console.log('hee');
                
                const Model = await getSchema(id,'students')
                   const count = await Model.find({}).count() 

                   
                return count
            } catch (error) {
                
                
            }
    }

    async fetchTeacherCount(id:string){
        try {
            console.log('hwww');
            
            const Model = await getSchema(id,'teachers')
            const count = await Model.find({}).count()
            return count
        } catch (error) {
            console.log(error);
            
        }
    }

      //Class & Subject CRUD Operations  


    async subjectExists(subject:string,classNumber:string,id:string){
        const Model = await getSchema(id,'subjects')
        const status = await Model.findOne({
            class:classNumber,
            'subjects.name':subject})
        return !!status
    }
    async addSubject(classNumber: string,subject:string, document: SubjectsDocument, id: string): Promise<boolean> {
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

    async deleteSubject(id:string,classNum:string,subject:string){
        try {
            const Model = await getSchema(id,'subjects');
            const updatedDocument = await Model.findOneAndUpdate(
                { class: classNum },
                { $pull: { subjects: { name: subject } } },
                { new: true }
            );
    
            if (!updatedDocument) {
              return false
                
            }
    
            return true;
        } catch (error) {
            
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

    async updateSubject(id: string, classNum: string, newSubject: string, subjectId: string) {
        try {
                   // Get the model for the provided ID and collection
    const Model = await getSchema(id, 'subjects');

    // Find the class by classNum and subject by subjectId
    const updateStatus = await Model.findOneAndUpdate(
      { class: classNum, 'subjects._id': subjectId },
      { $set: { 'subjects.$.name': newSubject } }, // Updating the name of the subject
      { new: true } // To return the updated document
    );

    if (!updateStatus) {
      // If no matching document found
      
      return false;
    }

 
    return true;
          } catch (error) {
            console.log(error);
            return false;
          }
    }
    

     // Teacher CRUD Operations


    async addSubToTeacher(id: string, teacherEmail: string, classNum: string, subjectId: string,subjectName:string) {
        try {
            console.log(subjectId,'fhwoehw');
            
            const Model = await getSchema(id, 'teachers');
            // First, check if the classNum exists
            const teacher = await Model.findOne({ email: teacherEmail, "classNsub.classNum": classNum });
            if (teacher) {
                // If the classNum exists, push the subject to the existing array
                await Model.updateOne(
                    { email: teacherEmail, "classNsub.classNum": classNum },
                    { $push: { "classNsub.$.subject": {name:subjectName,Id:subjectId} } }
                );
                return true
            } else {
                // If the classNum does not exist, add a new object with the classNum and the subject
                await Model.updateOne(
                    { email: teacherEmail },
                    { $push: { classNsub: { classNum: classNum, subject: [{name:subjectName,Id:subjectId}] } } }
                );
                return true
            }
            console.log('Subject added successfully');
        } catch (error) {
            console.log(error);
            return false
        }
    }
    

    async teacherExists(id:string,data:Iteachers){
        try {
            console.log('in teacher exist check');
            
            const Model = await getSchema(id, 'teachers');
            const teacher = await Model.findOne({ email:data.email });
            const stat= !!teacher;
            if(stat){  
                console.log('teacher found');
                               
                return true           
                }else{
                    console.log('teacher not found');
                    
                    return false
                }
                

        } catch (error) {
            return false
        }
    }

    // async teacherUnassigned(id:string,password:string,data:Iteachers){
    //     try {
    //         const Model = await getSchema(id, 'teachers');

    //         // Create a new teacher document without classNsub property
    //         const newTeacher: teachers = {
    //             name: data.name,
    //             email: data.email,
    //             password: password,  
    //             classNsub :[{classNum:'',subject:['']}]
    //         };
    
    //         // Create and save the new teacher document
    //         await Model.create(newTeacher);
    //         return true
    //     } catch (error) {
    //         return false
    //     }
    // }

    async existingClass(id:string,data:Iteachers){
        try {
            const Model = await getSchema(id, 'teachers');
            const teacher = await Model.findOne({ email: data.email });
    if(teacher){
                const existingClassIndex = teacher.classNsub.findIndex((c: classNsub) => c.classNum === data.class);
                if (existingClassIndex !== -1) {
                    const existingClass = teacher.classNsub[existingClassIndex]; 
                   return existingClass
                }else {
                                    // Class doesn't exist, create new entry for class with the subject
                                    teacher.classNsub.push({ classNum: data.class, subject: [data.subjectId] });
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
                    { $push: { 'classNsub.$.subject': data.subjectId } }
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

    async isSubjectAssignedToAnotherFaculty(id:string, data: Iteachers) {
        try {
            
            const Model = await getSchema(id, 'teachers');
           const isExist = await Model.exists({
                'classNsub.classNum': data.class,
                'classNsub.subject.Id': data.subjectId,
                email: { $ne: data.email } // Exclude current teacher from the search
            });
            if(isExist){
                console.log('is assigned');
                
                return true
            } else {
                console.log('sub not assigned');
                
                return false
            }
        } catch (error) {
            return false
        }
        
    }
  
    async addTeachers(password:string,data:Iteachers,id:string){
        try { 
            console.log('new teacher adding function');
            
            const Model = await getSchema(id, 'teachers'); 
                const newTeacher: teachers = {
                    name: data.name,
                    email: data.email,         
                    password: password,
                    isBlocked:false,
                    classNsub: [{ classNum: data.class, subject: [{name:data.subjectName,Id:data.subjectId}] }]
                }
                await Model.create(newTeacher);
    
            return true; 
        } catch (error) {
            console.error('Error saving or updating teacher:', error);
            return false; 
        }
    }

    async fetchTeacherData(id:string){
        try {
            const Model = await getSchema(id,'teachers');
            const data:teachers[] = await Model.find({})
            return data
        } catch (error) {
            console.log('repo error',error);
            
        }
    }
  
    async toggleBlock(email:string,id:string){
        try {
                       
            const Model = await getSchema(id,'teachers')
            const data = await  Model.findOne({email:email})
                        
            const setStatus  = !data.isBlocked
            
            const changedStatus = await Model.updateOne(
                {email:email},
                {$set:{isBlocked:setStatus}}                
                )

            return changedStatus
        } catch (error) {
            console.log(error);
            return false            
        }
    }

    //Student CRUD  Operations
    async studentExists(id:string,email:string){
        try {
            const Model = await getSchema(id,'students')
            const exists = await Model.findOne({email:email})
            return !!exists
        } catch (error) {
            console.log(error);                        
        }
    }

    async addStudent(id:string,student:Istudent){
        try {
            const Model = await getSchema(id,'students')
            const addStudent = await Model.create(student)
            return !!addStudent
            
        } catch (error) {
            console.log(error);
            return false            
        }
    }

    async fetchStudents(id:string){
        try {
    const Model = await getSchema(id,'students')
    const data = await Model.find({})
    return data            
        } catch (error) {
            console.log(error);
            return null
        }
    }

}