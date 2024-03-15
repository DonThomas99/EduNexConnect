import teacherRepo from "../infrastructure/repository/teacherRepository"
import teacherRepository from "./interface/teacherRepo"


export default class teacherUseCase{

constructor(
 private  teacherRepository:teacherRepo
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

async uploadMaterial(teacherId:string,subjectId:string,id:string,materialTitle:string,pdf:string,content:string){
    try {
    const document ={
        teacherId:teacherId,
        subjectId:subjectId,
        materialTitle:materialTitle,
        pdf:pdf,
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
       
        const data = await this.teacherRepository.fetchMaterials(subjectId,teacherId,id)
            
        if(data){
            return {
                status:200,
                data:data,
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
async uploadAssignment(subjectId:string,teacherId:string,content:string,assignmentTitle:string,pdf:string,date:string,time:string,id:string){
    try {
        const document ={
            teacherId:teacherId,
            subjectId:subjectId,
            assignmentTitle:assignmentTitle,
            pdf:pdf,
            content:content,
            date:date,
            time:time
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

}