import studentRepository from "../../use_case/interface/studentRepository";
import { getSchema } from "../utils/switchDb";
import { SubjectName } from "../../domain/subjectInterface";
import { ListSearchIndexesCursor } from "mongodb";
import { assign } from "nodemailer/lib/shared";

export default class studentRepo implements studentRepository{
//  private subject:SubjectName
    async login(id:string,email:string){
        try {
                const Model = await getSchema(id,'students')
                console.log(Model);
                
                const data = await Model.findOne({email:email})
                return data
            } catch (error) {
            console.log(error);
            return null
            
        }
    }
    async findStudent(email:string,id:string){
        try {
            const Model = await getSchema(id,'students')
            const data = await Model.findOne({email:email})
            return data
        } catch (error) {
        console.log(error);
        return null                
        }
    }

    async fetchSubjects(classNum:string,id:string){
        try {
            const Model = await getSchema(id,'subjects')
            const data = await Model.findOne({class:classNum})
            return data 
        } catch (error) {
            console.log(error);
            return null            
        }
    }
    async fetchAssignments(subjectId: string, id: string, page: number = 1, limit: number = 4) {
        try {
            const Model = await getSchema(id, 'assignments');
            const data = await Model.find({ subjectId: subjectId })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }); // Sort by createdAt in descending order
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchAssignmentsCount(subjectId:string,id:string){
        try {
            const Model = await getSchema(id,'assignments')
            const data = await Model.find({subjectId:subjectId})
            .count()
            return data
        } catch (error) {
            console.log(error);
            
        }
    }


    async fetchMaterialCount(subjectId:string,id:string){
        try {
            const Model = await getSchema(id,'materials')
            const data = await Model.find({subjectId:subjectId})
            .count()
            return data
        } catch (error) {
            console.log(error);
            
        }
    }
    
    async fetchMaterials(subjectId: string, id: string, page: number = 1, limit: number = 4) {
        try {
            const Model = await getSchema(id, 'materials');
            const data = await Model.find({ subjectId: subjectId })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }); // Sort by createdAt in descending order
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async fetchRoomId(subjectId:string,id:string,classNum:string){
    try {
       
        
        const Model = await getSchema(id, 'subjects');
    const data = await Model.findOne({
        class: classNum,
        "subjects._id": subjectId
    });
if(data){
    
    const subjectIndex = data.subjects.findIndex((subject:SubjectName) => subject._id == subjectId)
    if(subjectIndex !== -1){
         const roomId = data.subjects[subjectIndex].roomId
            // Check if roomId is null or does not exist, return null
    if (!roomId) {
        return null;
    }
    return roomId
    }
}
        
  

    // Return the roomId if it exists and is not null
    // return data.subjects.roomId;
    } catch (error) {
        console.log(error);
        
    }

    }

        //----------------------------Submissions CRUD operations---------------------------

    async uploadAssignment(assignmentId:string,subjectId:string,id:string,studentEmail:string,file:string){
        try {

            
            const document = {
                assignmentId :assignmentId,
                studentEmail:studentEmail,
                subjectId:subjectId,
                file_url:file
            }
            const Model = await getSchema(id,'submissions')
            const newSubmission = new Model(document)
            const uploadStatus = await newSubmission.save()
            if(uploadStatus){
                return true
            } else {
                return false
            }
            
        } catch (error) {
            console.log(error);
            return false 
        }
    }

    async submissionExists(id:string,assignmentId:string,studentEmail:string){
    try {
        const Model = await getSchema(id,'submissions')
        const isExist = await  Model.find({
            assignmentId:assignmentId,
            studentEmail:studentEmail
        })
        console.log(isExist);
        
        if(isExist.length>0){
            return true
        } else{
            return false
        }
    } catch (error) {
        console.log(error);
        return false
    }

    }

    async updateSubmissions(id:string,assignmentId:string,studentEmail:string,file:string){
        try {
            const Model = await getSchema(id,'submissions')
            const update = await Model.findOneAndUpdate(
                {assignmentId:assignmentId,studentEmail:studentEmail},
                {$push:{file_url:file}},
                {new:true}
            )
            if (update.lastErrorObject && update.lastErrorObject.updatedExisting) {
                return true; // Document was updated
            } else {
                return false; // Document was not updated
            }
            
        } catch (error) {
            console.log(error);
            return false
            
        }
    }

    async fetchSubmissions(id:string,assignmentId:string,studentEmail:string){
        try {
            const Model = await getSchema(id,'submissions')
            const url = await Model.find({
                assignmentId:assignmentId,
                studentEmail:studentEmail
            }).select('file_url')
            if(url.length>0){
                
                return url
            }else{
                return null
            }
        } catch (error) {
            console.log(error);
            return null
        }
    }
    
}