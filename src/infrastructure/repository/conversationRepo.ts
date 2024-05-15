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

    async getConversations(id:string,senderId:string){
        try {
            const Model = await getSchema(id,'conversationModel')
            const conversation = await Model.find({members:{$in:[senderId]}}) 
            if(conversation){
                return conversation
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    async getConversation(id:string,conversationId:string){
        try {   
                const Model = await getSchema(id,'conversationModel')
                const conversation = await Model.findById(conversationId)
                if(conversation){
                    return conversation             
                } else{
                    return null
                }
        } catch (error) {
            console.log(error)
            return null
        }
    }
}