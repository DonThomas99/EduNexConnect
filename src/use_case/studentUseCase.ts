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
}