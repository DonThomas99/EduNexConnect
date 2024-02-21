import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    userId: {
      type: String,
      required: true,
    },
    password:{
        type:String,
        required:true,
    },
    classNsub:[
        {
            classNum:{
                type:String
            },
            subject:[{

                type:String
            }]
        }
    ],
    
    },

);

export { teacherSchema };