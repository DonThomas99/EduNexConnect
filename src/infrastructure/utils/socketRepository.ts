import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import MessageRepository from "../repository/messageRepo";
import { Imessage, message, userId } from "../../domain/messages";
const messageRepository = new MessageRepository();

interface User {
    userId: userId;
    socketId: string;
}

export default class SocketRepository {
    private io: SocketIOServer;
    private users: User[] = [];

    constructor(httpServer: HttpServer, io: SocketIOServer) {
        // console.log('heee');
        
        this.io = io;
        io.on("connection",(socket:Socket)=>{
            console.log('The service is on ');
            
            this.handleConnection(socket)
        })
        // this.io.on("connection", this.handleConnection);
    }

    private handleConnection = (socket: Socket) => {
        console.log('a user connected');
        socket.on('addUser', user => {
            console.log('Incoming user :',user);
            
            this.addUser(user, socket.id);
        });

        socket.on("disconnect", () => {
            this.removeUser(socket.id);
            this.io.emit("getUsers", this.users);
        });

        socket.on('sendMessage', async (tenantId: string, data:Imessage,recipientId:string) => {
            
            const recieverId = recipientId
            const saveData = {
                conversationId: data.conversationId,
                sender: data.sender,
                text: data.text
            };
      
        
         const status =   await messageRepository.newMessage(tenantId,saveData); // Uncomment and implement this method in MessageRepository
     
      
         if(status){
                         console.log('status exists');
                             
             const receiver = this.getUser(recieverId); // Uncomment and implement this method in SocketRepository
           
            //  console.log(receiver?.userId.recieverId);
             
    if(receiver?.userId.recieverId){
        console.log('trying to emit the reciveMessage to send the message after writing it to the data base');
        
        // this.io.to(receiver.socketId).emit(recieverId, saveData.text);
        this.io.emit(recieverId,saveData)
    }             
             
         }  
        });

        socket.on('getMessages',async (tenantId:string,conversationId:string) =>{
            const messages = await messageRepository.findMessages(tenantId,conversationId)
            this.io.emit(conversationId,messages)
        })
    };

    private addUser(userId: userId, socketId: string): void {
        if (!this.users.some(user => user.userId.senderId === userId.senderId)) {
            this.users.push({ userId, socketId });
            console.log('after adding:',this.users);
            
        }
    }

    private removeUser(socketId: string) {
        this.users = this.users.filter((user) => user.socketId!== socketId);
    }

    private getUser = (receiverId: string) => {
        console.log('In getUser',receiverId);
        
        const response= this.users.find(user => user.userId.recieverId == receiverId);
    console.log(response,'hoew');
    return response
    
    };

    
}
