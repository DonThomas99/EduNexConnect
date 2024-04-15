import mongoose, { Schema } from "mongoose";

const conversationsSchema:Schema = new mongoose.Schema({
    members:{
        type:Array
    },
    assignmentId:{
        type:String,
        required:true
    }
},{
    timestamps:true
}
)

export {conversationsSchema}