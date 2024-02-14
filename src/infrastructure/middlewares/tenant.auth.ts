import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import tenantRepository from '../repository/tenantRepository';


export const tenantAuth = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const token = req.headers.authorization
        if(token){
            const decoded = jwt.verify(token.slice(7),process.env.JWT_KEY as string ) as JwtPayload
            const tenantData = await tenantRepository
        }
    } catch (error) {
        
    }
}