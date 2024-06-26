import mongoose,{Schema,Document,ObjectId, Model } from 'mongoose'
import { ITenants } from '../../domain/tenants';

type TenantSchemaType = ITenants & Document

export const TenantSchema:Schema = new Schema<TenantSchemaType>({
    name : {
        type: String,
        required:true
    },
    mobile:{
        type : String,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    school:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },

    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:Number,
        required:true
    },
    schoolAdmins:[
        {
        adminId:String,
        password:String,
        is_Blocked:{
         type:Boolean,
            required:true,
         default:false
        }
    },
],
    transactions:[ {
      transactionType:{
          type:String,
          required:true
      },
      planId:{
        type:String,
        required:true
      },      
      amount: {
        type:Number
    },
      date:{
        type:Date,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    }

    }], 
    isBlocked:{
        type:Boolean,
        required: true,
        default:false
    }
},
{
    timestamps:true
}
);

const TenantModel: Model<TenantSchemaType> = mongoose.model<TenantSchemaType>('Tenant',TenantSchema)

export default TenantModel


