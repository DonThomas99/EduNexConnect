import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    class:{
        type:String,
        required:true,
    },
    chapters:{
        type:Number,
        required:true
    }
},

);

export { subjectSchema };