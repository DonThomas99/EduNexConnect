import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    subjectId:{
        type:String,
    },
    teacherId:{
        type:String
    },
    assignmentTitle:{
        type:String
    },
    pdf:{
        type:String
    },
    content:{
        type:String
    },
    submissionDate:{
        type:Date
    },
    // submissionTime:{
    //     type:String
    // },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export {assignmentSchema}