import { Imessage, message } from "../../domain/messages";
import messageRepo from "../../use_case/interface/messageRepository";
import { getSchema } from "../utils/switchDb";

export default class messageRepository implements messageRepo{
    async newMessage(id:string,message:Imessage){
        try {
            const Model = await getSchema(id,'messages')
            const newMessage = new Model(message)
            const savedMessage = await newMessage.save()
            return savedMessage
        } catch (error) {
            console.log(error);
        }
    }

    async findMessages(id:string,conversationId:string){
        try {
                const Model = await getSchema(id,'messages')
                const messages = await Model.find({conversationId})
                return messages             
        } catch (error) {
            console.log(error);
            
        }
    }
}