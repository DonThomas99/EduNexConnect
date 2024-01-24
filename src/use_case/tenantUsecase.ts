import tenant from "../domain/tenants";
import tenantRepository from "../infrastructure/repository/tenantRepository"


class tenantUsecase{
    private tenantRepository: tenantRepository
  async signup(tenant:tenant){
        const isExisting = await this.tenantRepository.findByEmail(tenant.email)
        if(isExisting){
            return {
                status:401,
                data:"tenant Exists"
            }
        } else {
            return {
                status:200,
                data:tenant
            }
        }
    }
    signIn(body: any) {
        throw new Error("Method not implemented.");
    }
    constructor(tenantRepository:tenantRepository){
        this.tenantRepository = tenantRepository
    }




}
export default tenantUsecase