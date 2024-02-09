
import SuperAdminRepository from "../../use_case/interface/superAdminRepository"
import superAdmin from "../../domain/superAdmin";
import { getSchema } from "../utils/switchDb";

class superAdminRepository implements SuperAdminRepository{
    
    async findByEmail(email:string): Promise< superAdmin| null>{
        console.log(email, 'email from repository');
        const superAdminModel = await getSchema("EduNextConnect","admins")
        let check=await superAdminModel.find({})
        
        return await superAdminModel.findOne({email:email})
    }
}

export default superAdminRepository