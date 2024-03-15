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
    submissiondate:{
        type:Date
    },
    // submissionTime:{
    //     type:tim
    // },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export {assignmentSchema}