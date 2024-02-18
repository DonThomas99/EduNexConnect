import schoolAdminRepository from "../../use_case/interface/schoolAdminRepo";
import { getSchema,switchDB } from "../utils/switchDb";

export default class schoolAdminRepo implements schoolAdminRepository {
    async findById(id:string,name:string){
        console.log('came here');
        
        const Model = await getSchema(id,'schoolAdmin')
        console.log('Model:',Model);
        
        const document = await Model.findOne({adminId:name})
        return document 
        
    }
}