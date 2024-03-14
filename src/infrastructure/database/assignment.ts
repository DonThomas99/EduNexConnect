import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    subjectId:{
        type:String,
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
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export {assignmentSchema}