import { ITenants } from "../../domain/tenants";
interface tenantRepository {
    save(tenant: ITenants):any;
    findByEmail(email:string):any
}


export default tenantRepository