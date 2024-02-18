import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required:true
    },
    teacherId: {
      type: String,
      required: true,
    },
    password:{
        type:String,
        required:true,
    },
    subject:[
        {
            subjectName:{

                type:String
            },
            class:{
                type:String
            }
        }
    ]
    },

);

export { teacherSchema };