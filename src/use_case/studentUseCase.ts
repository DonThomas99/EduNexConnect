import studentRepo from "../infrastructure/repository/studentRepository";
export default class studentUseCase{
    constructor(
      private  studentRepo:studentRepo
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
async fetchAsnmtMat(subjectId:string,id:string){
    try {
        const asmntData = await this.studentRepo.fetchAssignments(subjectId,id)
        const materialData = await this.studentRepo.fetchMaterials(subjectId,id)
                
         const uploadsArray = [...materialData,...asmntData]
         console.log(uploadsArray,':Hee');
         
       
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


}