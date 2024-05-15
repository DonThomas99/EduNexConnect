import {Request,Response} from 'express';
import conversationUseCase from '../use_case/conversationUseCase';
import jwt,{ JwtPayload } from 'jsonwebtoken';

export default class conversationController{
private convoCase:conversationUseCase
    constructor(
        convoCase:conversationUseCase,
    ){
this.convoCase = convoCase
    }    

    async newConversation(req:Request,res:Response){
        try {
            const {id,assignmentId} = req.body
            const {studentId,teacherId} = req.body.members
            const response = await this.convoCase.newConversation(id,studentId,teacherId,assignmentId) 
            if(response){
                res.status(response.status).json({data:response.data,message:response.message})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error Fetching Conversation'})           
        }
    }

    async getConversations(req:Request,res:Response){
        try {
            const {id,conversationId} = req.body
            const response = await this.convoCase.getConversation(id,conversationId)
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error Sending Message'})
        }
    }

}