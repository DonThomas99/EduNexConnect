import mongoose from "mongoose";
// export const connectDB = async()=>{
//     try {
//         const mongouri = process.env.MONGO_URI
//         console.log(mongouri, 'mongouri');
        
//         if(mongouri){
//             await mongoose.connect(mongouri)
//             console.log("connected to db");
//         }
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }





const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
}

export const schoolConnectDB =  () => {
  return new Promise((resolve, reject) => {
    const mongoURL = process.env.MONGO_URI as string
    mongoose
      .connect(mongoURL, mongoOptions)
      .then((conn) => {
        console.log(`connected to ${conn.connections[0].name}:${conn.connections[0].port}`)
        resolve(conn)
      })
      .catch((error) => reject(error))
  })
}

