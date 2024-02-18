import schoolAdminRepo from '../infrastructure/repository/schoolAdminRepo'
import JwtCreate from '../infrastructure/utils/jwtCreate';


class schoolAdminUseCase{
    
    constructor(
    private readonly schoolAdminRepo:schoolAdminRepo,
    private readonly  JwtCreate:JwtCreate,
    

){
    
}

async login(name:string,password:string,id:string){
    try {
        console.log('in usecase');
        
            const document = await this.schoolAdminRepo.findById(id,name);
console.log(document);

            if (document) {
                console.log('document from repo',document);
                
                if(password === document.password)
                 {
                    // Generate tokens
                    const accessToken = this.JwtCreate.createJwt(document._id as unknown as string);
                    const refreshToken = this.JwtCreate.generateRefreshToken(document._id as unknown as string); // Implement your refresh token generation logic here

                    // Set the refresh token in the user object (for future use)
                    // await this.tenantRepository.setRefreshToken(emailDb._id as unknown as  string, refreshToken);
                    console.log('access done');
                    console.log('refresg done');



                    // Send the tokens in the response
                    return {
                        status: 200,
                        data: {
                            accessToken,
                            refreshToken,
                            
                        }
                    };
                } else {
                    return {
                        status: 401,
                        data: null

                    };
                }
            } else {
                return {
                    status: 400,
                    data: null,
                    message: 'User Not Found'
                };
            }
        
    } catch (error) {
        
    }
}

}
export default schoolAdminUseCase