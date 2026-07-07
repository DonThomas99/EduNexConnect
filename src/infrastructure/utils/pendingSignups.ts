import { ITenants } from "../../domain/tenants"

interface PendingSignup {
    tenant: ITenants
    otp: string
    expiresAt: number
}

const OTP_TTL_MS = 10 * 60 * 1000

const pendingSignups = new Map<string, PendingSignup>()

export function setPendingSignup(email: string, tenant: ITenants, otp: string): void {
    pendingSignups.set(email, { tenant, otp, expiresAt: Date.now() + OTP_TTL_MS })
}

export function getPendingSignup(email: string): PendingSignup | undefined {
    const entry = pendingSignups.get(email)
    if (!entry) {
        return undefined
    }
    if (Date.now() > entry.expiresAt) {
        pendingSignups.delete(email)
        return undefined
    }
    return entry
}

export function clearPendingSignup(email: string): void {
    pendingSignups.delete(email)
}
