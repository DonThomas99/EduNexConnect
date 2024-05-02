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

    async fetchStudents(id:string,classNum:string){
        try {
            
            const Model = await getSchema(id,'students')
            const status = await Model.find({classNum:classNum})
                if(status.length > 0){
                    return status 
                } else {
                    return null
                }
        
        } catch (error) {
            return false 
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
    //-----------------------------Assignment CRUD Operations------------------

    async fetchAssignments(subjectId: string, id: string, page: number, limit: number = 4) {
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

    //--------------------Materials CRUD operations---------------

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

    async fetchUrl(id: string, n: number, assignmentId: string, studentEmail: string) {
        try {
            console.log(n,assignmentId,studentEmail);
            
            const Model = await getSchema(id, 'submissions');
            const result = await Model.aggregate([
                {
                    $match: {
                        assignmentId: assignmentId,
                        studentEmail: studentEmail
                    }
                },
                {
                    $project: {
                        fileUrlElement: {
                            $arrayElemAt: ["$file_url", Number(n)] // Fetch the n-th element of the file_url array
                        }
                    }
                }
            ]);
       

            // Assuming you want to return the first element of the result array
            // If the result is empty, it means no matching document was found
            return result.length > 0 ? result[0].fileUrlElement : null;
        } catch (error) {
            console.log(error);
            return null;
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
            console.log(!!update);
            
            if (!!update) {
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

    async deleteSubmissions(id:string,n:string,assignmentId:string,studentEmail:string){
        try {
            const Model = await getSchema(id,'submissions')
            const urlUpdate = await Model.updateOne(
                { assignmentId: assignmentId, studentEmail: studentEmail },
                { $pull: { file_url:n } } 
            );
            console.log('Element removed:', urlUpdate);
            return !!urlUpdate
        } catch (error) {
            console.log(error);
            
        }
    }
    
}