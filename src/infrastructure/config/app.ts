import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import tenantRoute from '../route/tenantRoute'
import session, {SessionOptions} from 'express-session'
import superAdminRouter from "../route/superAdminRoute"
import { checkTenantMiddleware } from "../middlewares/checkTenant"

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


      app.use(checkTenantMiddleware)
      app.use('/super-admin',superAdminRouter)

      app.use('/tenant',tenantRoute)
      // const pathName = req.originalUrl.split('?')[0]
      return app
//  }
  // catch (error) {
    // console.log(error);
//  }
}