import mongoose, { Schema } from "mongoose";

const MessageSchema:Schema = new mongoose.Schema({
    conversationId:{
        type:String
    },
    sender:{
        type:String
    },
    text:{
        type:String
    }
},
{
timestamps:true
}) 

export default MessageSchema