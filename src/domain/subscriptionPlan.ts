export interface subscripitonPlan{
    amount:number,
    planName:string,
    durationUnit:string,
    durationValue:string,
}

export interface OsubscripitonPlan{
    _id:string,
    amount:number,
    planName:string,
    durationUnit:string,
    durationValue:string,
}

export interface ItenantPlan{
    plan: OsubscripitonPlan;
    tenantId: string;
    date: string;
}