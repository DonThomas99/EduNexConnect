import { setPendingSignup, getPendingSignup, clearPendingSignup } from "../pendingSignups";
import { ITenants } from "../../../domain/tenants";

const makeTenant = (email: string, name: string): ITenants => ({
    _id: undefined as any,
    email,
    mobile: "1234567890",
    isBlocked: false,
    password: "hashed",
    name,
    school: "Test School",
    address: "123 Main St",
    state: "State",
    city: "City",
    zip: 12345,
    schoolAdmins: [],
    transactions: [],
});

describe("pendingSignups", () => {
    afterEach(() => {
        clearPendingSignup("schoolA@test.com");
        clearPendingSignup("schoolB@test.com");
    });

    it("returns the stored tenant and otp for the email it was set under", () => {
        setPendingSignup("schoolA@test.com", makeTenant("schoolA@test.com", "School A"), "1111");

        const pending = getPendingSignup("schoolA@test.com");

        expect(pending).toBeDefined();
        expect(pending?.otp).toBe("1111");
        expect(pending?.tenant.name).toBe("School A");
    });

    it("returns undefined for an email with no pending signup", () => {
        expect(getPendingSignup("nobody@test.com")).toBeUndefined();
    });

    it("keeps concurrent signups from different emails fully isolated (the concurrency bug this replaced req.app.locals for)", () => {
        setPendingSignup("schoolA@test.com", makeTenant("schoolA@test.com", "School A"), "1111");
        setPendingSignup("schoolB@test.com", makeTenant("schoolB@test.com", "School B"), "2222");

        const pendingA = getPendingSignup("schoolA@test.com");
        const pendingB = getPendingSignup("schoolB@test.com");

        expect(pendingA?.otp).toBe("1111");
        expect(pendingA?.tenant.name).toBe("School A");
        expect(pendingB?.otp).toBe("2222");
        expect(pendingB?.tenant.name).toBe("School B");
    });

    it("expires an entry after the TTL", () => {
        jest.useFakeTimers();
        setPendingSignup("schoolA@test.com", makeTenant("schoolA@test.com", "School A"), "1111");

        expect(getPendingSignup("schoolA@test.com")).toBeDefined();

        jest.advanceTimersByTime(10 * 60 * 1000 + 1);

        expect(getPendingSignup("schoolA@test.com")).toBeUndefined();
        jest.useRealTimers();
    });

    it("clearPendingSignup removes the entry so a later verify attempt fails cleanly", () => {
        setPendingSignup("schoolA@test.com", makeTenant("schoolA@test.com", "School A"), "1111");
        clearPendingSignup("schoolA@test.com");

        expect(getPendingSignup("schoolA@test.com")).toBeUndefined();
    });
});
