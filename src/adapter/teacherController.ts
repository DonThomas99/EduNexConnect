import teacherUseCase from "../use_case/teacherUseCase";
import { Request,Response } from "express";
class teacherController{
private teacherCase:teacherUseCase
constructor(
    teacherCase:teacherUseCase
){
this.teacherCase = teacherCase
}
async login(req:Request,res:Response){
    try {
        const {email,password,id} = req.body
        const status = await this.teacherCase.login(id,email,password)
        if(status){

            res.status(status.status).json(status.message)
        }
        
    } catch (error) {
res.status(500).json({message:'Error Please try after sometime'})
    }
}

async fetchTeacherData(req:Request,res:Response){
    try {
        const {id,email} = req.body
        const status = await this.teacherCase.fetchData(id,email)
        res.status(status.status).json(status.data)
    } catch (error) {
        res.status(500).json({message:'Error Please try after sometime'})
        
    }
}
async fetchStudents(req:Request,res:Response){
    try {            
            const{id,classNum}=req.body
            const response = await this.teacherCase.fetchStudents(id,classNum)
            if(response)
            res.status(response.status).json(response.data)
    } catch (error) {
        res.status(500).json({message:'Error in adding student'})
        
    }
}
//Material CRUD operations 
async uploadMaterial(req:Request,res:Response){
    try {
        const id = req.body.tenantId[0]
        const teacherId = req.body.subjectId[0]
        const subjectId = req.body.subjectId[0] 
        const {content,materialTitle} = req.body
        console.log(subjectId,teacherId,id);
        
    
        const response = await this.teacherCase.uploadMaterial(teacherId,subjectId,id,req.files,materialTitle,content)
        // res.status()
    } catch (error) {
        console.log(error);
           }
}


async fetchMaterials(req:Request,res:Response){
    try {
        console.log(req.body);
        
        const {subjectId,teacherId,id}= req.body
        const response = await this.teacherCase.fetchMaterials(subjectId,teacherId,id)
        if(response){
            res.status(response.status).json(response.data)
        }
    } catch (error) {
     console.log(error);
        
    }
}

async updateMaterial(req:Request,res:Response){
    try {
        console.log(req.body);
        const data = req.body.data
        const{materialId,id} = req.body
        const response = await this.teacherCase.updateMaterial(materialId,id,data)
        if(response){
            res.status(response.status).json({message:response.message})
        } else{
            res.status(500).json({message:'Error Updating Material'})

        }
    
    } catch (error) {
        console.log(error);
        res.status(409).json({message:'Error Updating Material'})
    }
}



//Assignment CRUD operations
async uploadAssignments(req:Request,res:Response){
try {    
    const id = req.body.tenantId[0]
    const teacherId = req.body.subjectId[0]
    const subjectId = req.body.subjectId[0] 
    const{content,assignmentTitle,dateTime} = req.body

    
    console.log(subjectId,teacherId,content,assignmentTitle,req.files,dateTime,id);
    
const response = await this.teacherCase.uploadAssignment(subjectId,teacherId,content,assignmentTitle,req.files,dateTime,id)
        if(response){
    res.status(response.status).json({message:response.message})
    } else{
        res.status(409).json({message:'Error Uploading Assignment'})
    }    

    
} catch (error) {
    console.log(error);
        
}
}

async fetchAssignments(req:Request,res:Response){
    try {
        const {subjectId, id,page } = req.body
          
            
            const response = await this.teacherCase.fetchAssignments(subjectId,id,page)
            if(response){
                const formattedResponse = {
                    Mat: response.data, // This is the array of assignments
                    count: response.assignmentCount // This is the count of assignments
                };
                res.status(response.status).json(formattedResponse)
            }
    } catch (error) {
        res.status(500).json({messge:'Error fetching Assignments'})
    }
}

async fetchSubmissions(req:Request,res:Response){
    try {
        const {email,assignmentId,id} = req.body             
            const response = await this.teacherCase.fetchSubmissions(email,assignmentId,id)
            if(response){
                res.status(response.status).json({url:response.url})
            }
           
    } catch (error) {
        console.log(error);
        
    }
}

async deleteAssignment(req:Request,res:Response){
    try {
        const {id,assignmentId} = req.body
        const response = await this.teacherCase.deleteAssignment(id,assignmentId)
        if(response){
            res.status(response.status).json(response.message)
        }else{
            res.status(500).json({message:'Error deleting the assignment'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error deleting the assignment'})
        
    }
}

async gradeAssignment(req:Request,res:Response){
    try {
        const {assignmentId,id,studentEmail,grade} =req.body
        
        const response = await this.teacherCase.gradeAssignment(assignmentId,studentEmail,id,grade)
        if(response){
            res.status(response.status).json({message:response.message})
        } else{
        res.status(500).json({message:'Error Grading student'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error Grading student'})
        
    }
}

async updateAssignment(req:Request,res:Response){
    try {
       
        const data = req.body.data
        const{assignmentId,id} = req.body
        const response = await this.teacherCase.updateAssignment(assignmentId,id,data)
        if(response){
            res.status(response.status).json({message:response.message})
        }else{
            res.status(500).json({message:'Error Updating Assignment'})

        }
    } catch (error) {
        res.status(409).json({message:'Error Updating Assignment'})
        console.log(error);
        
    }
}

//--------------submissions CRUD-----------
async fetchAllSubmissions(req:Request,res:Response){
    try {
        const {id,subjectId} = req.body
        console.log('id:',id);
        console.log('subjectId:',subjectId);     
        
        
        const response = await this.teacherCase.fetchAllSubmissions(id,subjectId)
        res.status(response.status).json({submissions:response.submissions})
    } catch (error) {
        console.log(error);
        res.status(500).json({data:'Error fetching submissions'})
        
    }
}


//---------------Start Class---------------

async startClass(req:Request,res:Response){
try {
    const {classNum,id,subjectId,roomId} = req.body
    // console.log('subjectId:',subjectId);
    
    const response = await this.teacherCase.startClass(id,subjectId,classNum,roomId)
    if(response)
    res.status(response.status).json(response.data)
} catch (error) {
    console.log(error);
    
}
}

async endClass(req:Request,res:Response){
    try {
        const {classNum,id,subjectId} = req.body
        const response = await this.teacherCase.endClass(id,subjectId,classNum)
        if(response)
            res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error);
        
    }
}

}
export default teacherController