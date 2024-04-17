import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    subjectId:{
        type:String,
    },
    teacherId:{
        type:String,
    },
    materialTitle:{
        type:String
    },
    pdf:{
type:Array<string>,
        
    },
    content:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})

export {materialSchema}