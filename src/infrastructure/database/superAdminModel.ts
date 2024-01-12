import mongoose,{Schema,Document,ObjectId} from 'mongoose'

export interface superAdmin extends Document{
    _id: ObjectId,
    email: string,
    password: string
}
const superAdminSchema: Schema = new Schema({
    email: {
        type:String
    },
    password: {
        type:String
    }
})
const superAdminModel = mongoose.model<superAdmin>('Admin',superAdminSchema)
export default superAdminModel