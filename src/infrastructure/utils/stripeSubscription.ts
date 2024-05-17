import Stripe from "stripe";
import { ItenantPlan } from "../../domain/subscriptionPlan";
import { Request } from "express";

const stripeSecretKey = 'sk_test_51PBH8NSBdm1wkPvdWGhuy4p7B3gjBUmm1ooYlZSSbEIqbBQTFGqEjj3XCLrAqIjuoZO9Cu7Fk5EbomURLkvl9tU4001lpiHcza';
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
                metadata:{tenantId:tenantPlan.tenantId}
            });

            // console.log(session);
            return session.url;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

async confirmSubscription(req:Request){
    try {
        const payload = req.body
        const payloadString = JSON.stringify(payload,null,2)
        const sig = req.headers["stripe-signature"]
        if(typeof sig !== "string"){
            return false
        }
        const endpointSecret = 'whsec_9cf41b7e0faa80da18972b9154353ef5089c85866f1131da43d4245880281cfe'
        const header = stripe.webhooks.generateTestHeaderString({
            payload:payloadString,
            secret:endpointSecret
        })
        let event;
        event  = stripe.webhooks.constructEvent(
            payloadString,
            header,
            endpointSecret
        )
        console.log(`Webhook Verified:`,event);
        if(event.type == "checkout.session.completed"){
            return true
        } else{
            return false
        }
        
    } catch (error) {
        console.log(error);
        
    }
}
  
    

}
