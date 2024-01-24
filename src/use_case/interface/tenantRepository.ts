import tenants from "../../domain/tenants";
interface tenantRepository {
    save(tenant: tenants):any;
    findByEmail(email:string):any
}
export default tenantRepository