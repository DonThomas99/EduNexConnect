import studentRepository from "../../use_case/interface/studentRepository";
import { getSchema } from "../utils/switchDb";

export default class studentRepo implements studentRepository{

    async login(id:string,email:string){
        try {
                const Model = await getSchema(id,'students')
                console.log(Model);
                
                const data = await Model.findOne({email:email})
                return data
            } catch (error) {
            console.log(error);
            return null
            
        }
    }
}