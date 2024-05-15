import messageRepository from '../infrastructure/repository/messageRepo';
import {message} from '../domain/messages';

export default class messageUseCase{
    private messageRepo:messageRepository
    constructor(messageRepo:messageRepository){
        this.messageRepo = messageRepo
    }
    async newMessage(id:string,message:message){
        try {
            const newMessage = await this.messageRepo.newMessage(id,message)
            console.log(newMessage);
            
        } catch (error) {
            console.log(error);
            return {
                status:409,
                data:error
            }
            
        }
    }
  async  getMessages(id:string,conversationId:string){
        try {
                const messages = await this.messageRepo.findMessages(id,conversationId)
                if(messages){
                       return{
                        status:200,
                        data:messages
                    }
                } else{
                    return {
                        status:409,
                        message:'Error Sending Message'
                    }
                }
        } catch (error) {
            console.log(error);
            return {
                status:409,
                return :error
            }
            
        }
    }
}