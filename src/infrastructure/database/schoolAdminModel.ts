import mongoose from "mongoose";

const schoolAdminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
      type:Boolean,
      default:false
    }
},

);

export  { schoolAdminSchema };