import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import tenantRepository from '../repository/tenantRepository';
import { getSchema } from '../utils/switchDb';

const repo = new tenantRepository(getSchema)

export const tenantAuth = async(req:Request,res:Response,next:NextFunction) => {
    try {

        const token = req.cookies?.tenantJwt
        if(!token){
            res.status(401).json({message:'No token provided'})
            return
        }
        const decoded = jwt.verify(token,process.env.JWT_KEY as string ) as JwtPayload


        const tenantData = await repo.findTenantById(decoded.id)


        if(tenantData != null){
            if(tenantData.isBlocked){
                res.status(403).json({message:'This Account is blocked please contact admin'})
            }else{
                next()
            }
        }else{
            res.status(401).json({message:''})
        }
    } catch (error) {
        res.status(401).json({message:'Invalid or expired token'})
    }
}