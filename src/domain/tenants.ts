import mongoose from "mongoose";

export interface ITenants {
    _id: mongoose.Types.ObjectId;
    email:string;
    mobile: string ;
    isBlocked:boolean ;
    password : string ;
    name:string ;
    school:string;
    address: string;
    state: string;
    // transactions: string;
}