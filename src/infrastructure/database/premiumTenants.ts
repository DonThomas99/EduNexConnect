import mongoose from "mongoose";

const premiumTenants = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    planName:{
        type:String,
        required:true
    },
    durationUnit:{
        type:String,
        required:true
    },
    durationValue:{
        type:String,
        required:true
    },
    tenantId:{
        type:String,
        required:true
    },
    startedDate:{
        type:Date,
        required:true,
    },
    expiryDate:{
        type:Date,
        required:true
    }

})

export {premiumTenants}