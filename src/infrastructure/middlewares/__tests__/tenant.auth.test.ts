jest.mock('jsonwebtoken');
jest.mock('../../repository/tenantRepository');
jest.mock('../../utils/switchDb', () => ({ getSchema: jest.fn() }));

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import TenantRepository from '../../repository/tenantRepository';
import { tenantAuth } from '../tenant.auth';

const mockedVerify = jwt.verify as jest.Mock;
const MockedRepo = TenantRepository as jest.MockedClass<typeof TenantRepository>;

function makeRes(): Response {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
    return res as Response;
}

describe('tenantAuth middleware', () => {
    let next: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        next = jest.fn();
        process.env.JWT_KEY = 'test-secret';
    });

    it('responds 401 when no token cookie is present, without calling next()', async () => {
        const req = { cookies: {} } as unknown as Request;
        const res = makeRes();

        await tenantAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('responds 401 when jwt.verify throws (invalid/expired token), instead of hanging', async () => {
        mockedVerify.mockImplementation(() => { throw new Error('jwt expired'); });
        const req = { cookies: { tenantJwt: 'bad-token' } } as unknown as Request;
        const res = makeRes();

        await tenantAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('responds 401 when the decoded tenant does not exist', async () => {
        mockedVerify.mockReturnValue({ id: 'someid' });
        MockedRepo.prototype.findTenantById.mockResolvedValue(null);
        const req = { cookies: { tenantJwt: 'good-token' } } as unknown as Request;
        const res = makeRes();

        await tenantAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('responds 403 and does not call next() when the tenant is blocked', async () => {
        mockedVerify.mockReturnValue({ id: 'someid' });
        MockedRepo.prototype.findTenantById.mockResolvedValue({ isBlocked: true } as any);
        const req = { cookies: { tenantJwt: 'good-token' } } as unknown as Request;
        const res = makeRes();

        await tenantAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('calls next() when the tenant exists and is not blocked', async () => {
        mockedVerify.mockReturnValue({ id: 'someid' });
        MockedRepo.prototype.findTenantById.mockResolvedValue({ isBlocked: false } as any);
        const req = { cookies: { tenantJwt: 'good-token' } } as unknown as Request;
        const res = makeRes();

        await tenantAuth(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
