const mockConstructEvent = jest.fn();

jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
        webhooks: { constructEvent: mockConstructEvent },
    }));
});

process.env.STRIPE_SECRET_KEY = 'sk_test_fake';

import { Request } from 'express';
import GenerateStripeSession from '../stripeSubscription';

function makeReq(sig: string | undefined, body: any = Buffer.from('{}')): Request {
    return {
        headers: sig !== undefined ? { 'stripe-signature': sig } : {},
        body,
    } as unknown as Request;
}

describe('GenerateStripeSession.confirmSubscription (Stripe webhook verification)', () => {
    let session: GenerateStripeSession;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.WEB_HOOK_SECRET = 'whsec_test_secret';
        session = new GenerateStripeSession();
    });

    it('rejects a request with no stripe-signature header', async () => {
        const result = await session.confirmSubscription(makeReq(undefined));

        expect(result.verified).toBe(false);
        expect(mockConstructEvent).not.toHaveBeenCalled();
    });

    it('rejects when Stripe signature verification throws (forged/invalid signature)', async () => {
        mockConstructEvent.mockImplementation(() => {
            throw new Error('No signatures found matching the expected signature for payload');
        });

        const result = await session.confirmSubscription(makeReq('bad-sig'));

        expect(result.verified).toBe(false);
        expect(result.subscription).toBeUndefined();
    });

    it('passes the raw body, header, and secret through to constructEvent unmodified', async () => {
        const rawBody = Buffer.from('{"id":"evt_1"}');
        mockConstructEvent.mockReturnValue({ type: 'payment_intent.created', data: { object: {} } });

        await session.confirmSubscription(makeReq('t=1,v1=abc', rawBody));

        expect(mockConstructEvent).toHaveBeenCalledWith(rawBody, 't=1,v1=abc', 'whsec_test_secret');
    });

    it('verifies but returns no subscription for event types other than checkout.session.completed', async () => {
        mockConstructEvent.mockReturnValue({ type: 'payment_intent.created', data: { object: {} } });

        const result = await session.confirmSubscription(makeReq('valid-sig'));

        expect(result.verified).toBe(true);
        expect(result.subscription).toBeUndefined();
    });

    it('extracts the full plan/tenant/date from checkout session metadata on checkout.session.completed', async () => {
        mockConstructEvent.mockReturnValue({
            type: 'checkout.session.completed',
            data: {
                object: {
                    metadata: {
                        tenantId: 'tenant123',
                        planId: 'plan456',
                        planName: 'Pro Plan',
                        amount: '999',
                        durationUnit: 'month',
                        durationValue: '1',
                        date: '2026-07-08T00:00:00.000Z',
                    },
                },
            },
        });

        const result = await session.confirmSubscription(makeReq('valid-sig'));

        expect(result.verified).toBe(true);
        expect(result.subscription).toEqual({
            tenantId: 'tenant123',
            date: '2026-07-08T00:00:00.000Z',
            plan: {
                _id: 'plan456',
                planName: 'Pro Plan',
                amount: 999,
                durationUnit: 'month',
                durationValue: '1',
            },
        });
    });

    it('verifies but returns no subscription when metadata is missing tenantId/planId (nothing to act on)', async () => {
        mockConstructEvent.mockReturnValue({
            type: 'checkout.session.completed',
            data: { object: { metadata: {} } },
        });

        const result = await session.confirmSubscription(makeReq('valid-sig'));

        expect(result.verified).toBe(true);
        expect(result.subscription).toBeUndefined();
    });
});
