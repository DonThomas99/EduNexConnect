import chatRepo from "../infrastructure/repository/conversationRepo";

export default class conversationUseCase{
    
    constructor(
         private convoRepo:chatRepo,
    ){
this.convoRepo = convoRepo
    }

    async newConversation(id:string,studentId:string,teacherId:string,assignmentId:string){
        try {
            const newConversation = await this.convoRepo.newConversations(id,teacherId,studentId,assignmentId)
            if(newConversation){
                return {
                    status:200,
                    data:newConversation
                }
            } else{
                return {
                    status:409,
                    message:'Error Fetching Conversation'
                }
            }
        } catch (error) {
            console.log(error);
            return {
                status:409,
                message:'Error Creating new Conversation'
            }
            
        }
    }

    // async getConversations(id:string,assignmentId:string){
    //     try {
    //         const conversations = await this.convoRepo.getConversations(id,assignmentId)
    //     } catch (error) {
    //         console.log(error);
    //         return {
    //             status:409,
    //             message:'Error Fetching Conversations'
    //         }
    //     }
    // }
    async getConversation(id:string,conversationId:string){
        try {
            const conversation = await this.convoRepo.getConversation(id,conversationId)
            if(conversation){
                return {
                    status:200,
                    data:conversation
                }
            } else{
                return {
                    status:409,
                    message:'Error Fetching Conversations'
                }
            }
        } catch (error) {
            console.log(error);
            return{
                status:409,
                message:'Error Fetching Conversation'
            }
        }
    }
}