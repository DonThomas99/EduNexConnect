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
   
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    classNsub:[
        {
            classNum:{
                type:String
            },
            subject:[{

                name:{
                    type:String
                },
                Id:{
                    type:String
                }
            }]
        }
    ],
   
    },

);

export { teacherSchema };