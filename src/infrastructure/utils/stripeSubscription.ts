import Stripe from "stripe";
import { ItenantPlan } from "../../domain/subscriptionPlan";
import { Request } from "express";
import dotenv from "dotenv"
dotenv.config();


const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
    throw new Error("Stripe secret key is not defined");
}

const stripe = new Stripe(stripeSecretKey);

export default class GenerateStripeSession {
    async confirmTransaction(tenantPlan: ItenantPlan): Promise<any> {
        console.log(tenantPlan.plan.durationUnit);
        
        try {
            const durationValue = tenantPlan.plan.durationValue as unknown as number;

            let interval: 'month' | 'year';
            let intervalCount: number;

            switch (tenantPlan.plan.durationUnit.toLowerCase()) {
                case 'month':
                    interval = 'month';
                    intervalCount = durationValue;
                    break;
                case 'year':
                    interval = 'month';
                    intervalCount = durationValue * 12;
                    break;
                default:
                    throw new Error(`Unsupported duration unit: ${tenantPlan.plan.durationUnit}`);
            }

            // Create a price object for the subscription
            const price = await stripe.prices.create({
                unit_amount: tenantPlan.plan.amount * 100, // Convert to cents
                currency: "inr",
                recurring: {
                    interval: interval,
                    interval_count: intervalCount
                },
                product_data: {
                    name: tenantPlan.plan.planName, // Provide the name of the product
                }
            });

            // Create a checkout session using the price object
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: price.id, // Use the price object ID here
                    quantity: 1,
                }],
                mode: "subscription", // Set to "subscription" for recurring payments
                success_url: `http://localhost:4200/subscribed`,
                cancel_url: "http://localhost:4200/cancelled",
                billing_address_collection: 'required',
                metadata:{
                    tenantId:tenantPlan.tenantId,
                    planId:tenantPlan.plan._id,
                    planName:tenantPlan.plan.planName,
                    amount:String(tenantPlan.plan.amount),
                    durationUnit:tenantPlan.plan.durationUnit,
                    durationValue:String(tenantPlan.plan.durationValue),
                    date:tenantPlan.date
                }
            });

            // console.log(session);
            return session.url;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

async confirmSubscription(req:Request):Promise<{verified:boolean,subscription?:ItenantPlan}>{
    try {
        const sig = req.headers["stripe-signature"]
        if(typeof sig !== "string"){
            return {verified:false}
        }
        const endpointSecret = process.env.WEB_HOOK_SECRET
        if(!endpointSecret){
            throw new Error("Stripe webhook secret is not defined")
        }
        // req.body must be the raw request buffer (see the express.raw()
        // middleware mounted on this route in app.ts) - Stripe signatures
        // are computed over the exact raw bytes, so a parsed/re-serialized
        // body will never verify, even with the correct secret.
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            endpointSecret
        )
        console.log(`Webhook Verified:`,event.type);
        if(event.type == "checkout.session.completed"){
            const session = event.data.object as Stripe.Checkout.Session
            const metadata = session.metadata
            // The full plan/tenant/date is carried in the checkout session's
            // own metadata (set at session-creation time) rather than in any
            // server-side memory, so this webhook is self-contained and
            // doesn't depend on state left behind by an earlier request.
            if(!metadata?.tenantId || !metadata.planId){
                return {verified:true}
            }
            return {
                verified:true,
                subscription:{
                    tenantId:metadata.tenantId,
                    date:metadata.date,
                    plan:{
                        _id:metadata.planId,
                        planName:metadata.planName,
                        amount:Number(metadata.amount),
                        durationUnit:metadata.durationUnit,
                        durationValue:metadata.durationValue
                    }
                }
            }
        }
        return {verified:true}
    } catch (error) {
        console.log("Webhook signature verification failed:",error);
        return {verified:false}
    }
}
  
    

}
