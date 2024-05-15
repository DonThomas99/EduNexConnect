import express,{Request} from "express"
import conversationController from "../../adapter/conversationController";
import conversationUseCase from "../../use_case/conversationUseCase";
import chatRepo from "../repository/conversationRepo";
import  messageController  from "../../adapter/messageController";
import  messageUseCase from "../../use_case/messageUseCase";
import messageRepository from "../repository/messageRepo";
const chatRepository = new chatRepo()
const msgRepo = new messageRepository()
const convoUseCase = new conversationUseCase(chatRepository)
const convoController = new conversationController(convoUseCase) 
const msgUseCase = new messageUseCase(msgRepo)
const mesgController = new messageController(msgUseCase)

const chatRoute = express()

chatRoute.post('/newconversation',(req:Request,res)=>{convoController.newConversation(req,res)})
chatRoute.get('/getconversation',(req:Request,res)=>{convoController.getConversations(req,res)})
chatRoute.get('/getconversations',(req:Request,res)=>{})

//--------------------Message Routes----------------
chatRoute.post('/newMessage',(req:Request,res)=>{mesgController.newMessage(req,res)})

export default chatRoute