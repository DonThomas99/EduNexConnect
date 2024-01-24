import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import tenantRoute from '../route/tenantRoute'
import session, {SessionOptions} from 'express-session'

export const createServer = ()=>{
//  try {
    
     const app = express()
     const httpServer = http.createServer(app)
     app.use(express.json())
     app.use(express.urlencoded({extended:true}))
     app.use(cookieParser())
     
      app.use(
        cors({ 
          origin:process.env.CORS_URL,
          // methods: 'GET,HEAD,PUT,POST,DELETE',
          credentials:true,
        })
      )
      const sessionOptions:SessionOptions={
        secret:'your-secret-key',
        resave:false,
        saveUninitialized:false,
        cookie:{
          secure:false,
          maxAge:3600000,
        }
      } 
      app.use(session(sessionOptions))
      app.use(tenantRoute)
      return app
//  }
  // catch (error) {
    // console.log(error);
//  }
}