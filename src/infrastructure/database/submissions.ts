import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    assignmentId:{
        type:String,
        required:true
    },
    studentEmail:{
        type:String,
        required:true
    },
    file_url:{
type:Array<string>,
required:true
    }
})

export {submissionSchema}
