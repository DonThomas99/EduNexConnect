import chatRepository from "../../use_case/interface/conversationRepo";
import { conversationsSchema } from "../database/conversations";
import { getSchema } from "../utils/switchDb";

export default class chatRepo implements chatRepository {
    // private getSchema = getSchema
    async newConversations (id:string,teacherId:string,studentId:string,assignmentId:string){
        try {
            const Model = await getSchema(id,'conversationModel')
            const  chatFound = await Model.findOne({members:{$all:[teacherId,studentId]},assignmentId:assignmentId})
            if(chatFound){
                return chatFound
            }
            const conversation = new Model({
                members:[teacherId,studentId],assignmentId
            })
            const newConversation = await conversation.save()
            return newConversation
        } catch (error) {
            console.log(error);
        }
    }

    async getConversations(id:string,conversationId:string){
        try {
            const Model = await getSchema(id,'conversationModel')
            const conversation = await Model.findById(conversationId) 
            return conversation
        } catch (error) {
            console.log(error);
            
        }
    }
}