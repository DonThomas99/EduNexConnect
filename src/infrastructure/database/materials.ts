import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    subjectId:{
        type:String,
    },
    materialTitle:{
        type:String
    },
    pdf:{
        type:String
    },
    content:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export {materialSchema}