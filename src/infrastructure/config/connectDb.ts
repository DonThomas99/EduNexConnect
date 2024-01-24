import mongoose from "mongoose";
export const connectDB = async()=>{
    try {
        const mongouri = process.env.mongouri
        if(mongouri){
            await mongoose.connect(mongouri)
        }
        console.log("connected to db");
        
    } catch (error) {
        console.log(error);
        
    }
}