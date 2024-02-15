import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import tenantRepository from '../repository/tenantRepository';
import { getSchema } from '../utils/switchDb';

const repo = new tenantRepository(getSchema)

export const tenantAuth = async(req:Request,res:Response,next:NextFunction) => {
    try { 
        
        const token = req.headers.authorization
        console.log(token);
        if(token){
            const decoded = jwt.verify(token.slice(7),process.env.JWT_KEY as string ) as JwtPayload
            
            
            const tenantData = await repo.findById(decoded.id)
            
            
            if(tenantData != null){
                if(tenantData.isBlocked){
                    res.status(403).json({message:'This Account is blocked please contact admin'})
                }else{
                    next()
                }
            }else{
                res.status(401).json({message:''})
            }
        }
    } catch (error) {
        
    }
}