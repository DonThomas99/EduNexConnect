import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import tenantRoute, { tenantController } from '../route/tenantRoute'
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
     // Stripe webhook signatures are verified against the exact raw request
     // bytes, so this route is registered with its own raw-body parser
     // ahead of the global JSON/sanitize middleware below.
     app.post('/api/subscriptions/webhook', express.raw({ type: 'application/json' }), (req, res) => tenantController.saveSubscription(req, res))
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