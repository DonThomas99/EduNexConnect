import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
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