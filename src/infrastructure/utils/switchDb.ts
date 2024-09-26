
// import TenantSchema from './models/tenantSchema.js';
// import EmployeeSchema from './models/employeeSchema.js';
import mongoose, { Connection, Model, model } from 'mongoose';
import { schoolConnectDB } from '../config/connectDb'; 
import { schoolAdminSchema } from '../database/schoolAdminModel';
import { TenantSchema } from '../database/tenantModel';
import { superAdminSchema } from '../database/superAdminModel';
import { subjectSchema } from '../database/subjectSchema';
import { teacherSchema } from '../database/teacherModel';
import { studentSchema } from '../database/studentSchema';
import { materialSchema } from '../database/materials';
import { assignmentSchema } from '../database/assignment';
import { conversationsSchema } from '../database/conversations';
import MessageSchema from '../database/messages';
import { submissionSchema } from '../database/submissions';
import { SubscriptionPlanSchema } from '../database/subscriptionPlans';
import { premiumTenants } from '../database/premiumTenants';
import { bannerSchema } from '../database/banner';

// Indicates which Schemas are used by whom

const ChildrenSchemas: Map<string, any> = new Map([['schoolAdmin', schoolAdminSchema],['subjects',subjectSchema],['teachers',teacherSchema],['students',studentSchema],['materials',materialSchema],['assignments',assignmentSchema],['conversationModel',conversationsSchema],['messages',MessageSchema],['submissions',submissionSchema]]);
const TenantSchemas: Map<string, any> = new Map([['tenants', TenantSchema],['admins',superAdminSchema],['subscriptionPlans',SubscriptionPlanSchema],['premiumTenants',premiumTenants],['bannerSchema',bannerSchema]]);

/** Switch db on the same connection pool
 * @return new connection
 */


const getSchema =  async (schoolName: string,modelName:string): Promise<any> => {
    if(modelName=="tenants"||modelName=="admins" || modelName =="subscriptionPlans" || modelName=="premiumTenants" || modelName=="bannerSchema"){
           
      const tenantDB: Connection = await switchDB('EduNextConnect', TenantSchemas);
     
      const tenantModel: Model<any> = await getDBModel(tenantDB, modelName);
      return tenantModel
    }
   
    
      const schoolDB: Connection = await switchDB(schoolName, ChildrenSchemas);
        
        const schoolModel: Model<any> = await getDBModel(schoolDB, modelName);
     console.log('model:',schoolModel);
     
        return schoolModel;
    
  }

  const switchDB = async (dbName: string, dbSchema: Map<string, any>): Promise<Connection> => {
    try {
      const mongooseInstance:any = await schoolConnectDB();
    
      if (mongooseInstance.connection.readyState === 1) {
        const db = mongooseInstance.connection.useDb(dbName);
        // Prevent from schema re-registration
        if (!Object.keys(db.models).length) {
          dbSchema.forEach((schema, modelName) => {
            db.model(modelName, schema);
          });
        }
        return db;
      } else {
        throw new Error('MongoDB connection is not open');
      }
    } catch (error) {
      console.error('Error switching database:', error);
      throw error; // Re-throw the error to propagate it up the call stack
    }
  };
  

/**
 * @return model from mongoose
 */

const getDBModel = async (db: Connection, modelName: string): Promise<Model<any>> => {
  return db.model(modelName);
};

export { switchDB,getSchema, TenantSchemas,ChildrenSchemas, getDBModel };