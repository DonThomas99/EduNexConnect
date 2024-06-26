import { createServer } from "./src/infrastructure/config/app";
// import  {connectDB}  from "./src/infrastructure/config/connectDb";
import dotenv from 'dotenv'
dotenv.config()
const startServer =async () => {
    try {
        // await connectDB()
        const app = createServer()
        app?.listen(3000,()=>{
            console.log('connected to server');
        })
    } catch (error) {
        console.log(error);
    }
}
startServer()