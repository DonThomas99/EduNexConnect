import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { getSchema } from '../switchDb';

let mongod: MongoMemoryServer;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

const makeStudent = (overrides: Partial<Record<string, string>> = {}) => ({
    email: 'alice@school-a.com',
    name: 'Alice',
    gaurdianName: 'Parent A',
    mobile: '1111111111',
    classNum: '5',
    password: 'hashed',
    ...overrides,
});

describe('switchDb multi-tenant database isolation', () => {
    it('writes to one school database and does not leak into a different school database', async () => {
        const schoolAStudents = await getSchema('school-a', 'students');
        const schoolBStudents = await getSchema('school-b', 'students');

        await schoolAStudents.create(makeStudent());

        const inSchoolA = await schoolAStudents.find({});
        const inSchoolB = await schoolBStudents.find({});

        expect(inSchoolA).toHaveLength(1);
        expect(inSchoolA[0].email).toBe('alice@school-a.com');
        expect(inSchoolB).toHaveLength(0);
    });

    it('routes tenant-scoped model names to the shared EduNextConnect database regardless of the school name passed in', async () => {
        const tenantsViaSchoolA = await getSchema('school-a', 'tenants');
        const tenantsViaSchoolB = await getSchema('school-b', 'tenants');

        expect(tenantsViaSchoolA.db.name).toBe('EduNextConnect');
        expect(tenantsViaSchoolB.db.name).toBe('EduNextConnect');
    });

    it('resolves the same school name to the same database on repeated calls', async () => {
        const first = await getSchema('school-a', 'students');
        const second = await getSchema('school-a', 'students');

        expect(first.db.name).toBe(second.db.name);
        expect(first.db.name).toBe('school-a');
    });
});
