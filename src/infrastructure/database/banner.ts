import mongoose, { Schema } from "mongoose";
const bannerSchema:Schema = new mongoose.Schema({
    bannerLink:{
        type:String,
        required:true
    },
    bannerText:{
        type:String,
        required:true
    }
})

export{bannerSchema}