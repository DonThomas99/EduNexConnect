import studentRepo from "../infrastructure/repository/studentRepository";
import Cloudinary from "../infrastructure/utils/cloudinary";
export default class studentUseCase{
    constructor(
      private  studentRepo:studentRepo,
      private cloudinary:Cloudinary
    ){
this.studentRepo = studentRepo
    }
    async login(email:string,password:string,id:string){
        try {

            const data = await this.studentRepo.login(id,email)
            if(data){
                console.log(data.password,password);
                
                if(data.password == password){

                    return {
                        status:200,
                        message:'Successfully Logged In'
                    }           
                }else{
                    return{
                        status:409,
                        message:'Wrong  password Try Again!!'
                    }
                }
            }else{
                return {
                    status:409,
                    message:'Student Not Found!!'
                }
            }
        } catch (error) {
            console.log(error);
            return{
                status:400,
                message:'Error Signing In!!'
            }
            
        }
    }

    async fetchStudentData(email:string,id:string){
        try {
            const data = await this.studentRepo.findStudent(email,id)
            if(data){
                return{
                    status:200,
                    data:data
                }
            } else{
                return {
                    status:409,
                    data:null,
                    message:'Error fetching data'
                }
            }
        } catch (error) {
            console.log(error);
            return {
                 status:500,
                 message:'Error fetching Student Data !!!'
            }
            
        }
    }

async fetchSubjects(classNum:string,id:string){
    try {
        const isExisting = await this.studentRepo.fetchSubjects(classNum,id)
        const subjects = isExisting.subjects
        if(isExisting){
            return{
                status:200,
                data:subjects
            } 
        } else{
            return {
                status:409,
                message:'Error Fetching Subjects'
            }
        }
    } catch (error) {
        console.log(error);
        return {
            status:500,
            message:'Error fetching Subject'
        }
        
    }
}

async fetchAsnmtMat(subjectId: string, id: string, page: number = 1, limit: number = 4) {
    try {
        
        const materialData = await this.studentRepo.fetchMaterials(subjectId, id, page, limit);
        const materialDataCount = await this.studentRepo.fetchMaterialCount(subjectId,id)
        const uploadsArray = [...materialData];
        
        uploadsArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (uploadsArray) {
            return {
                status: 200,
                data: uploadsArray,
                materialCount:materialDataCount
            };
        } else {
            return {
                status: 409,
                data: null
            };
        }
    } catch (error) {
        console.log(error);
    }
}

async fetchAssignments(subjectId:string,id:string,page:number, limit:number =4){
    try {
        const asmntData = await this.studentRepo.fetchAssignments(subjectId,id,page,limit)
        const assignmentCount = await this.studentRepo.fetchAssignmentsCount(subjectId,id)
        // asmntData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        asmntData.sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


        if(asmntData){
            return {
                status:200,
                data:asmntData,
                assignmentCount:assignmentCount
            }
        } else{
            return {
                status:409,
                data:null
            }
        }
    } catch (error) {
        console.log(error);
        
    }
}

async uploadAssignment(assignmentId:string,studentEmail:string,subjectId:string,file:Array<Object> | any,id:string,){
    try {        
        if (!file || !Array.isArray(file)) {
            console.error('No file(s) provided or file is not an array');
         console.log('soihefwoiu');
         
            return; // Exit the function early if file is not valid
        }

        const uploadAssignment = await Promise.all(
            file.map(async(file:any)=>{
                try {
                    return await this.cloudinary.savetoCloudinary(file)
                } catch (error) {
                    console.log(error);
                    return null
                }
            })
            )
            
            file = uploadAssignment.filter((file)=> file!= null)
            if(file){
                const isExists = await this.studentRepo.submissionExists(id,assignmentId,studentEmail)
                console.log('isExists');
                if(isExists){
                    
                    const updateStatus = await this.studentRepo.updateSubmissions(id,assignmentId,studentEmail,file[0])
                        if(updateStatus){
                            return {
                                status:200,
                                url:file,
                                message:'Assignment Uploaded successfully '
                            }
                        } else{
                            return {
                                status:409,
                                url:null,
                                message:'Assignment Upload Failed'
                            }
                        }
                    
                } else{
                const upload = await this.studentRepo.uploadAssignment(assignmentId,subjectId,id,studentEmail,file)
                if(upload){
                    
                    return {
                        status:200,
                        url:file,
                        message:'Assignment uploaded successfully'
                    }
                } else{
                    return {
                        status:409,
                        url:null,
                        message:'Assignment upload failed'
                    }
                }
            }
            }
            
    } catch (error) {
        console.log(error);
        
    }
}

async fetchSubmissions(id:string,assignmentId:string,studentEmail:string){
    try {
        const url = await this.studentRepo.fetchSubmissions(id,assignmentId,studentEmail)        
        if(url){
                return {
                    status:200,
                    url:url[0].file_url
                }
               } else{
                return {
                    status:204,
                    url:null
                }
               }

    } catch (error) {
        console.log(error);
        
    }
}

//--------------------OnlineClass----------------
async fetchRoomId(subjectId:string,id:string,classNum:string){
    try {
        const data = await this.studentRepo.fetchRoomId(subjectId,id,classNum)
        if(data){
            return{
                status:200,
                data:data
            }
        } else{
            return {
                status:200,
                data:null
            }
        }
    } catch (error) {
        console.log(error);
        return{
            status:500,
            data:null
        }
        
    }
}

}