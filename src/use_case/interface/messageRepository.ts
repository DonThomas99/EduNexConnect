import { message } from "../../domain/messages"

  export default  interface messageRepository{
        newMessage(id:string,message:message):Promise<any>
        findMessages(id:string,conversationId:string):Promise<any>
    }
    
