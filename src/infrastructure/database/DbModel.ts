import { Document,Model } from "mongoose";
interface DbDocument extends Document{
    createdAt:Date;
    updateAt:Date;
}