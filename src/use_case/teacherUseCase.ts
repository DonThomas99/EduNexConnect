import teacherRepo from "../infrastructure/repository/teacherRepository"
import Cloudinary from "../infrastructure/utils/cloudinary"
import teacherRepository from "./interface/teacherRepo"
import { Assignment } from "../domain/material"


export default class teacherUseCase{

constructor(
 private  teacherRepository:teacherRepo,
 private cloudinary:Cloudinary

){
this.teacherRepository =teacherRepository
}

async login(id:string,email:string,password:string){
    try {
        const teacherData = await this.teacherRepository.login(id,email)
            if(teacherData.password == password){
                return{
                    status:200,
                    message:'Login success'
                }
            }else{
                return{
                    status:409,
                    message:'Incorrect Password'
                }
            }
    } catch (error) {
        return {
            status:500,
            message:'Login failed'
        }
    }
}

async fetchData(id:string,email:string){
    try {
        const array = await this.teacherRepository.fetchData(id,email)
        return {
            status:200,
            data:array
        }
    } catch (error) {
    return {
        status:500,
        message:'Unable to fetch data '
    }      
    }
}

//----------------Material Upload-------------------

async uploadMaterial(teacherId:string,subjectId:string,id:string,file:Array<Object> | any,materialTitle:string,content:string){
    try {

        if (!file || !Array.isArray(file)) {
            console.error('No file(s) provided or file is not an array');
         console.log('soihefwoiu');
         
            return; // Exit the function early if file is not valid
        }
        const uploadMaterial = await Promise.all(
            file.map(async(file:any)=>{
                try {
                    return await this.cloudinary.savetoCloudinary(file)
                } catch (error) {
                    console.log(error);
                    return null
                }
            })
            )
            file = uploadMaterial.filter((file)=> file!= null)

    const document ={
        teacherId:teacherId,
        subjectId:subjectId,
        materialTitle:materialTitle,
        pdf:file,
        content:content
    }       
    console.log(document);
    
    const status = await this.teacherRepository.uploadMaterial(document,id)
    } catch (error) {
        console.log(error);
        
    }
}

async fetchMaterials(subjectId:string,teacherId:string,id:string){
    try {
        const asmntData = await this.teacherRepository.fetchAssignments(subjectId,id)
        const materialData = await this.teacherRepository.fetchMaterials(subjectId,id)
                
         const uploadsArray = [...materialData,...asmntData]
         
         
       
        uploadsArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if(uploadsArray)
        {

            
            return {
                status:200,
                data:uploadsArray
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

async updateMaterial(materialId:string,id:string,data:Partial<Assignment>){
    try {
        const updateStatus = await this.teacherRepository.updateMaterial(id,materialId,data)
        if(updateStatus){
            return {
                status:200,
                message:' Material Updated Successfully'
            }
        } else{
            return{
                status:409,
                message:'Error Updating Material'
            }
        }

    } catch (error) {
        
    }
}

//---------------------Assignment CRUD Operations----------------
async uploadAssignment(subjectId:string,teacherId:string,content:string,assignmentTitle:string,file:Array<Object> | any,dateTime:Date,id:string){
    try {

        
        if (!file || !Array.isArray(file)) {
            console.error('No file(s) provided or file is not an array');         
            return; // Exit the function early if file is not valid
        }
        const uploadMaterial = await Promise.all(
            file.map(async(file:any)=>{
                try {
                    return await this.cloudinary.savetoCloudinary(file)
                } catch (error) {
                    console.log(error);
                    return null
                }
            })
            )
            file = uploadMaterial.filter((file)=> file!= null)

        const document ={
            teacherId:teacherId,
            subjectId:subjectId,
            assignmentTitle:assignmentTitle,
            pdf:file,
            content:content,
            submissionDate:dateTime,   
        }  
        const upload = await this.teacherRepository.uploadAssignment(id,document)
            if(upload){
                return {
                    status:200,
                     message:'Assignment successfully uploaded'   
                }
            } else{
                return {
                    status:409,
                    message:'Error Uploading Assignment'
                }
            }
    } catch (error) {
        console.log(error);
        
    }
}

async fetchAssignment(subjectId:string,id:string,teacherId:string){
    try {
        
    } catch (error) {
        return {
            status:500,
            message:'Unable to fetch data '
        }

    }
}

async fetchSubmissions(email:string,assignmentId:string,id:string){
    try {
        const url = await  this.teacherRepository.fetchSubmissions(email,assignmentId,id)   
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

async deleteAssignment(id:string,assignmentId:string){
    try {
        const status = await this.teacherRepository.deleteAssignment(id,assignmentId)
        if(status){
            return {
                status:200,
                message:'Assignment Deleted Successfully'
            }
        } else{
            return {
                status:200,
                message:'Error deleting assignment'
            }
        }
        
    } catch (error) {
        console.log(error);
        
    }
}

async gradeAssignment(assignmentId:string,studentEmail:string,id:string,grade:string){
    try {
        const gradeStatus = await this.teacherRepository.addGrade(id,assignmentId,studentEmail,grade)
        if(gradeStatus){
            return{
                status:200,
                message:'Successfully Updated Grade'
            }
        } else{
            return {
                status:409,
                message:'Error Updating grade'
            }
        }
    } catch (error) {
        console.log(error);
        return {
            status:409,
            message:'Error Updating grade'
        }
    }
   

}

async updateAssignment(assignmentId:string,id:string,data:Partial<Assignment>){
    try {
      
        const updateStatus = await this.teacherRepository.updateAssignment(id,assignmentId,data)
        if(updateStatus){
            return {
                status:200,
                message:'Updated Assignment Successfully'
            }
        } else{
            return{
                status:409,
                message:'Error Updating Assignment'
            }
        }

        
    } catch (error) {
        console.log(error);
        return{
            status:409,
            message:'Error Updating Assignment'
        }
        
    }
}

//--------------------Student Operations------------- 

async fetchStudents(id:string,classNum:string){
    try {
        const data = await this.teacherRepository.fetchStudents(id,classNum)
        if(data){
            return{
                status:200,
                data:data
            }
        }
        
    } catch (error) {
        console.log(error); 
    }
}


//-----------------------Online Class Operations-------------------------
async startClass(id:string,subjectId:string,classNum:string,roomId:string){
    try {
    const data = await this.teacherRepository.startClass(id,subjectId,classNum,roomId)     
    if(data){
        return{
            status:200,
            data:true
        }
    } else{
        return {
            status:409,
            data:false
        }
    }   
    } catch (error) {
        console.log(error);
        
    }
}

async endClass(id:string,subjectId:string,classNum:string){
    try {
        const status = await this.teacherRepository.endClass(id,subjectId,classNum)
        if(status){
            return {
                status:200,
                data: 'Call Ended Successfully'
            }
        } else{
            return {
                status:409,
                data:'Error Ending Call'
            }
        }
    } catch (error) {
        console.log(error);
        
    }
}

}