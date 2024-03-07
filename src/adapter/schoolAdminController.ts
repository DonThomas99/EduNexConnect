import schoolAdminUseCase from "../use_case/schoolAdminUseCase"
import { Request,Response } from "express"


class schoolAdminController{
    private schoolAdminCase: schoolAdminUseCase
    constructor(
        schoolAdminCase:schoolAdminUseCase
    ){
this.schoolAdminCase = schoolAdminCase
    }

    async schoolAdminLogin(req:Request,res:Response){
        try {
         console.log('body:',req.body);
                    const {name,password,id} = req.body
                    const result = await this.schoolAdminCase.login(name,password,id)
                    if(result){
                        console.log('hdsd');
                        
                        return res.status(result.status).json(result.data)
                    }
        } catch (error) {
            console.log(error);
            
        }
    }

    //Class and Subjects CRUD operations


    async addSubject(req:Request,res:Response){
        try {
            const {classNumber,subject,id}= req.body
            const result = await this.schoolAdminCase.addSubjects(classNumber,subject,id)                
            if(result)
            res.status(result.status).json(result.data)
        } catch (error) {
            console.log(error);
            
        }
    }
    async deleteSubject(req:Request,res:Response){
        try {
            const {classNum,subject,id} = req.body
            const result = await this.schoolAdminCase.deleteSubject(id,classNum,subject)
            return res.status(result.status).json(result.message)
            
        } catch (error) {
            
        }
    }
    async fetchClasses(req:Request,res:Response){
        try {
            const id = req.body.id as unknown as string
            const response = await this.schoolAdminCase.fetchClasses(id)
            if(response){
                
                res.status(response.status).json(response.data)
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    

    //Teachers CRUD operations


    async addSubjectToTeacher(req:Request,res:Response){
        try {
            const {teacherEmail,classNum,subject,id} = req.body
            const added = await this.schoolAdminCase.addSubToTeacher(id,teacherEmail,classNum,subject)
            if(added){
                res.status(added.status).json(added.message)
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }
async addTeacher(req:Request,res:Response){
    try {
            const {id,data} = req.body
            const response = await this.schoolAdminCase.addTeacher(data,id)
            if(response){
console.log('response from backend',response);

                return res.status(response.status).json(response.message)
            }
    } catch (error) {
        return res.status(500).json({message:'Error Please try Later!!!'})
        
    }
}
    async fetchTeacherData(req:Request,res:Response){
        try {
            const id = req.body.id as unknown as string 
            const response = await this.schoolAdminCase.fetchTeacherData(id)
            
            if(response){
                res.status(response.status).json(response.data)
            }
        } catch (error) {
            console.log('controller error',error);
            
        }
    }

    async toggleBlock(req:Request,res:Response){
        try {
            const {email,id} = req.body
            console.log('in the controller');
            
            const response = await this.schoolAdminCase.toggleBlock(email,id)
            return res.status(response.status).json(response.message)
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error Changing Status!!!'})
            
        }
    }



        //Student CRUD operations 


async addStudent(req:Request,res:Response){
try {
    const{

        name,
        email,
        gaurdianName,
        mobile,
        classNum,
     
    } = req.body.student
    // console.log(req.body);
    // const student= req.body.student
    const id = req.body.id as unknown as string
    
    const response = this.schoolAdminCase.addStudent(id,name,email,gaurdianName,mobile,classNum)
    // return res.status(response.status).json(response.message)
} catch (error) {
    console.log(error);
}
}

async fetchStudents(req:Request,res:Response){
    try {
        const id = req.body.id as unknown as string
        const response = await this.schoolAdminCase.fetchStudents(id)
        if(response){
            res.status(response.status).json(response.data)
        }
    } catch (error) {
        console.log(error);
        
    }
}

}

export default schoolAdminController