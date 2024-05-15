import {Request,Response} from 'express'
import  messageUseCase  from '../use_case/messageUseCase'

export default class messageController{
    private messageUseCase:messageUseCase
    constructor(messageUseCase:messageUseCase){
        this.messageUseCase = messageUseCase
    }
    async newMessage(req:Request,res:Response){
        try {
            const {id,message,senderId} = req.body
            const newMessage = await this.messageUseCase.newMessage(id,message)
            console.log(newMessage);            
            if(newMessage){
                res.status(200).json(newMessage)
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error Sending Messages'})
        }
    }

    async getMessages(req:Request,res:Response){
        try {
            const {id,conversationId} = req.body
            const messages = await this.messageUseCase.getMessages(id,conversationId)
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error Fetching Messages'})            
        }
    }

}