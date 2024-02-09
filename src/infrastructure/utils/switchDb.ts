
// import TenantSchema from './models/tenantSchema.js';
// import EmployeeSchema from './models/employeeSchema.js';
import mongoose, { Connection, Model } from 'mongoose';
import { schoolConnectDB } from '../config/connectDb'; 
import { schoolAdminSchema } from '../database/schoolAdminModel';
import { TenantSchema } from '../database/tenantModel';
import { superAdminSchema } from '../database/superAdminModel';

// Indicates which Schemas are used by whom

const ChildrenSchemas: Map<string, any> = new Map([['schoolAdmin', schoolAdminSchema]]);
const TenantSchemas: Map<string, any> = new Map([['tenants', TenantSchema],['admins',superAdminSchema]]);

/** Switch db on the same connection pool
 * @return new connection
 */


const getSchema =  async (schoolName: string,modelName:string): Promise<any> => {
    if(modelName=="tenants"||modelName=="admins"){
     
      
      const tenantDB: Connection = await switchDB('EduNextConnect', TenantSchemas);
     
      const tenantModel: Model<any> = await getDBModel(tenantDB, modelName);
      return tenantModel
    }
   
    
      const schoolDB: Connection = await switchDB(schoolName, ChildrenSchemas);
        
        const schoolModel: Model<any> = await getDBModel(schoolDB, modelName);
        return schoolModel;
    
  }

const switchDB = async (dbName: string, dbSchema: Map<string, any>): Promise<Connection> => {
  const mongooseInstance:any = await schoolConnectDB() 

  if (mongooseInstance.connection.readyState === 1) {
    const db = mongooseInstance.connection.useDb(dbName);
    // Prevent from schema re-registration
    if (!Object.keys(db.models).length) {
      dbSchema.forEach((schema, modelName) => {
        db.model(modelName, schema);
      });
    }
    return db;
  }
  throw new Error('error');
};

/**
 * @return model from mongoose
 */

const getDBModel = async (db: Connection, modelName: string): Promise<Model<any>> => {
  return db.model(modelName);
};









export { switchDB,getSchema, TenantSchemas,ChildrenSchemas, getDBModel };