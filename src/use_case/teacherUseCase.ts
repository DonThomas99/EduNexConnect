import teacherRepo from "../infrastructure/repository/teacherRepository"
import Cloudinary from "../infrastructure/utils/cloudinary"
import teacherRepository from "./interface/teacherRepo"


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

//---------------------Assignment CRUD Operations----------------
async uploadAssignment(subjectId:string,teacherId:string,content:string,assignmentTitle:string,pdf:string,dateTime:Date,id:string){
    try {
        const document ={
            teacherId:teacherId,
            subjectId:subjectId,
            assignmentTitle:assignmentTitle,
            pdf:pdf,
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