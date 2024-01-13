import mongoose,{Schema,Document,ObjectId } from 'mongoose'

export interface Itenants extends Document {
    _id: ObjectId;
    email:String | null;
    mobile: string | null;
    isBlocked:Boolean | null;
    password : string | null;
    name:string | null;
    address: string| null;
    state: string|null;
}

const TenantSchema:Schema = new Schema({
    name : {
        type: String,
        required:true
    },
    mobile:{
        type : String,
        require: true
    },
    email: {
        type: String
    },
    password:{
        type:String,
        require:true
    },

    address:{
        type:String,
        require:true
    },

    state:{
        type:String,
        require:true
    },
    
    transactions:[ {
      transactionType: String,
      method:String,
      amount: Number,
      date:Date,
    }], isBlocked:{
        type:Boolean,
        default:false
    }
},
    {
        timestamps:true
    }

);

const TenantModel= mongoose.model<Itenants>('Tenant',TenantSchema)

export default TenantModel


