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
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  heartbeatFrequencyMS: 10000, // Check server status every 10 seconds
}

let isConnecting = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

export const schoolConnectDB = (): Promise<typeof mongoose> => {
  // If already connected, return the existing connection
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  // If currently connecting, return the existing promise
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  // Start new connection
  isConnecting = true;
  const mongoURL = process.env.MONGO_URI as string;
  
  if (!mongoURL) {
    isConnecting = false;
    return Promise.reject(new Error('MONGO_URI is not defined in environment variables'));
  }

  connectionPromise = mongoose
    .connect(mongoURL, mongoOptions)
    .then((conn) => {
      console.log(`Connected to MongoDB: ${conn.connection.name}:${conn.connection.port}`);
      isConnecting = false;
      return conn;
    })
    .catch((error) => {
      isConnecting = false;
      connectionPromise = null;
      console.error('MongoDB connection error:', error);
      throw error;
    });

  // Handle connection events
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    isConnecting = false;
    connectionPromise = null;
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
    isConnecting = false;
    connectionPromise = null;
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });

  return connectionPromise;
}

