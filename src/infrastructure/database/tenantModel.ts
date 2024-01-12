import mongoose,{Schema,Document,ObjectId } from 'mongoose'

export interface Itenants extends Document {
    _id: ObjectId;
    email:String | null;
}
