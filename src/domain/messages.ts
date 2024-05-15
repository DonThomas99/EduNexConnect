export interface message{
    _id:string,
    conversationId:string,
    sender:string,
    text:string
}

export interface Imessage{
    conversationId:string,
    sender:string,
    text:string
}

export interface userId{
    recieverId:string,
    senderId:string
}
