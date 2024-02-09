import superAdminRepository from "../infrastructure/repository/superAdminRepository";
import tenantRepository from "../infrastructure/repository/tenantRepository";
import JwtCreate from "../infrastructure/utils/jwtCreate";
class superAdminUsecase {
constructor(
    private readonly superAdminRepository:superAdminRepository,
    private readonly tenantRepository:tenantRepository,
    private JwtCreate : JwtCreate
){

}
    async adminLogin(email:string,password:string){
        try {
           
            
            const admin = await this.superAdminRepository.findByEmail(email)
            if(admin){
                if(password === admin.password){
                    const jwt = this.JwtCreate.createJwt(admin._id as unknown as string )
                    return {
                        status:200,
                        data:{jwt,admin}
                    }
                }else{
                    return {
                        status:401,
                        data:null,
                        message:'Invalid Password'
                    }
                }
            }else{
                return {
                    status:400,
                    data:null,
                    message:'Admin Not Found'
                }
            }
        } catch (error) {
            console.log((error as Error).message)
            return {
                status: 500,
                data:null,
                message:'Internal Server Error'
            }
        }
       
}

async findAll(){
    try {
        const arr = await this.tenantRepository.findAll()
        // if(arr.length){
        const length = arr.length   
        return {
                status : 200,
                data:{arr,length}
                
            }
        
    } catch (error) {
        
    }
}


async blockUnblock(id:string){
    try {
        const tenantStatus = await this.tenantRepository.blockUnblock(id)
        
    } catch (error) {
        
    }

 }

 async findById(id:string){
try {
    const Data = await this.tenantRepository.findById(id)
    if(Data){
        return {
            status:200,
            data:Data
        }
    } else{
        return {
            status:404
        }
    }
} catch (error) {
    console.log(error);
    
}
 }

}
export default  superAdminUsecase