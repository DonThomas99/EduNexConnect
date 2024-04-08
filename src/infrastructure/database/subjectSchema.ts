import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
 
    class:{
        type:String,
        required:true,
    },
    subjects:[{
   name:{
        type: String,
        required: true,
      },
      roomId:{
        type:String,
        default:null
      }
    },]
},

);

export { subjectSchema };