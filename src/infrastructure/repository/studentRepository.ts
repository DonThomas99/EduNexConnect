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
    async findStudent(email:string,id:string){
        try {
            const Model = await getSchema(id,'students')
            const data = await Model.findOne({email:email})
            return data
        } catch (error) {
        console.log(error);
        return null                
        }
    }

    async fetchSubjects(classNum:string,id:string){
        try {
            const Model = await getSchema(id,'subjects')
            const data = await Model.findOne({class:classNum})
            return data 
        } catch (error) {
            console.log(error);
            return null            
        }
    }
    async fetchAssignments(subjectId:string,id:string){
        try {
            const Model = await getSchema(id,'assignments')
            const data = await Model.find({subjectId:subjectId})
            return data
        } catch (error) {
            console.log(error);
            
        }
    }
    async fetchMaterials(subjectId:string,id:string){
        try {
            const Model = await getSchema(id,'assignments')
            const data = await Model.find({subjectId:subjectId})
            return data
        } catch (error) {
            console.log(error);
            
        }
    }

}