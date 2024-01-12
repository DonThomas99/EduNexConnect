import express from "express"

export const createServer = ()=>{
 try {
    
     const app = express()
     app.use(express.json())
     return app
 }
  catch (error) {
    console.log(error);
 }
}