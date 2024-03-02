import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    gaurdianName:{
        type:String,
        required:true,
    },
    mobile:{
      type:String,
      required:true,
    },
    
    classNum:{
        type:String,
        required:true
    }
},

);

export { studentSchema };