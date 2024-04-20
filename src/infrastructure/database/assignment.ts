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
    grade:{
        type:String,
        default:null
    },
    content:{
        type:String
    },
    submissionDate:{
        type:Date
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

export {assignmentSchema}