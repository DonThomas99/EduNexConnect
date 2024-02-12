import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    password:{
        type:String,
        required:true,
    },
    class:{
        type:String,
        required:true
    }
},

);

export { studentSchema };