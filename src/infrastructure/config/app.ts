import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import tenantRoute from '../route/tenantRoute'
import session, {SessionOptions} from 'express-session'
import superAdminRouter from "../route/superAdminRoute";
import { checkTenantMiddleware } from "../middlewares/checkTenant";
import schoolRouting  from '../middlewares/schoolRouting';
import  SocketRepository  from "../utils/socketRepository"
import { Server as SocketIOServer } from "socket.io"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
const xss = require( "xss-clean")
const morgan = require('morgan'); 

export const createServer = ()=>{
//  try {
    
     const app = express()
     const httpServer = http.createServer(app)

     const io = new SocketIOServer(httpServer, {
      cors: {
        origin: 'http://localhost:4200',
        methods: ["GET", "POST"],
      },
    });

    new SocketRepository(httpServer,io)

     app.use(morgan('dev'))
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


      app.use(helmet())

      app.use(mongoSanitize())
      app.use(xss())

      app.use('/super-admin',superAdminRouter)
      
      app.use('/tenant',tenantRoute)
      
      app.use('/',schoolRouting)
      app.use(checkTenantMiddleware)
      // const pathName = req.originalUrl.split('?')[0]
      return httpServer
//  }
  // catch (error) {
    // console.log(error);
//  }
}