import mongoose from "mongoose";
import dotenv from "dotenv"
export const connectDB = async() =>{
    const mongo_uri = process.env.MONGO_URI
    console.log(mongo_uri);
    try {
            await mongoose.connect(mongo_uri as string);
            if (mongoose.connection.readyState === 1){
                const val = mongoose 
                return val 
            } else {
                console.log('not connected');
                
            }
        
    } catch (error) {
        console.log(error);
        console.log('Error found in try of connection');
        
        
    }
}
module.exports = connectDB