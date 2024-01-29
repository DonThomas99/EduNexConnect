// import mongoose,{Schema,Document,ObjectId, Model } from 'mongoose'
// import { ITempTenants } from '../../domain/tempTeants';

// type TenantSchemaType = ITempTenants & Document

// const TenantSchema:Schema = new Schema<TenantSchemaType>({
//     name : {
//         type: String,
//         required:true
//     },
//     // mobile:{
//     //     type : String,
//     //     required: true
//     // },
//     email: {
//         type: String,
//         required:true
//     },
//     // password:{
//     //     type:String,
//     //     required:true
//     // },
//     // school:{
//     //     type:String,
//     //     require:true
//     // },
//     // address:{
//     //     type:String,
//     //     required:true
//     // },

//     // state:{
//     //     type:String,
//     //     required:true
//     // },
//     // transactions:[ {
//     //   transactionType: String,
//     //   method:String,
//     //   amount: Number,
//     //   date:Date,
//     // }], 
//     // isBlocked:{
//     //     type:Boolean,
//     //     required: true,
//     //     default:false
//     // }
// },
// {
//     timestamps:true,
//     expires:600
// }
// );

// const TenantModel: Model<TenantSchemaType> = mongoose.model<TenantSchemaType>('Tenant',TenantSchema)

// export default TenantModel


