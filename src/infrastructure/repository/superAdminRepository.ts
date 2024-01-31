import superAdminModel from "../database/superAdminModel";
import SuperAdminRepository from "../../use_case/interface/superAdminRepository"
import superAdmin from "../../domain/superAdmin";

class superAdminRepository implements SuperAdminRepository{
    async findByEmail(email:string): Promise< superAdmin| null>{
        console.log(email, 'email from repository');
        
        return await superAdminModel.findOne({email:email})
    }
}

export default superAdminRepository