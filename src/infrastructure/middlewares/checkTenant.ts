// checkTenantMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { getSchema } from '../utils/switchDb'; // Import the function to get schema

// Define a custom interface extending the original Request interface
interface CustomRequest extends Request {
    tenant?: string; // Add the 'tenant' property

}

export const checkTenantMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const schoolName = extractSchoolName(req); // Extract the school name from the request URL

        // Get the model for the tenants collection from the main database
        const tenantModel = await getSchema('EduNextConnect', 'tenants');

        // Query the tenants collection in the main database
        const tenant = await tenantModel.findOne({ school: schoolName });

        if (!tenant) {
            return res.status(404).send('School not found'); // School not found, return 404
        }
            console.log("you got it:",tenant);
            
        // Attach the tenant document to the request object for further use
        req.tenant = tenant;

        next(); // Call next middleware or route handler
    } catch (error) {
        console.error('Error checking school:', error);
        return res.status(500).send('Internal Server Error');
    }
};

// Helper function to extract school name from the request URL
const extractSchoolName = (req: Request): string => {
    const parts = req.path.split('/'); // Split the request path by '/'
    return parts[1]; // The school name is the second part of the request path
};
