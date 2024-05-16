import mongoose from 'mongoose';

const SubscriptionPlanSchema = new mongoose.Schema({
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
    }

})

export {SubscriptionPlanSchema}