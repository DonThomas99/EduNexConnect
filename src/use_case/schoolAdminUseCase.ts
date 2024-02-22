import schoolAdminRepo from '../infrastructure/repository/schoolAdminRepo'
import JwtCreate from '../infrastructure/utils/jwtCreate';
import modifyData from '../infrastructure/utils/dataTransform'
import {Iteachers} from '../domain/teachers';
import passwordGenerator from '../infrastructure/utils/passwordGenerator';
import sendOtp from '../infrastructure/utils/sendMail';


class schoolAdminUseCase{
    
    constructor(
        private readonly pwdGen:passwordGenerator,
    private readonly schoolAdminRepo:schoolAdminRepo,
    private readonly  JwtCreate:JwtCreate,
    private readonly sendPwd:sendOtp
    

){
    
}

async login(name:string,password:string,id:string){
    try {
        
        
            const document = await this.schoolAdminRepo.findById(id,name);


            if (document) {
                
                
                if(password === document.password)
                 {
                    // Generate tokens
                    const accessToken = this.JwtCreate.createJwt(document._id as unknown as string);
                    const refreshToken = this.JwtCreate.generateRefreshToken(document._id as unknown as string); // Implement your refresh token generation logic here

                    // Set the refresh token in the user object (for future use)
                    // await this.tenantRepository.setRefreshToken(emailDb._id as unknown as  string, refreshToken);




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

async addSubjects(classNumber:string,subject:string,id:string){
    try {
            const status = await this.schoolAdminRepo.subjectExists(subject,classNumber,id)
            
            if(!status){
                const documentToInsert ={
                    class:classNumber,
                    subjects:[
                        {
                            name:subject
                        }
                    ]
                }
                const save = await this.schoolAdminRepo.addSubject(classNumber,subject,documentToInsert,id)
                    if(save){
                     return {
                        status:200,
                        data:{
                            message:'subject added Successfully!!! '
                        }
                     }   
                    } else{
                        return{
                            status:500,
                            data:{
                                message:'Subject addition failed. Please try again later'
                            }
                        }
                    }
         
            } else{
                return {
                    status:500,
                    data:{
                        message:'Please try again later.'
                    }
                }
            }
            
                      
    } catch (error) {
        console.log(error);
        
    }
}

async addTeacher(data:Iteachers,id:string){
    try {
            const isAssigned = await this.schoolAdminRepo.isSubjectAssignedToAnotherFaculty(id,data)
            if(!isAssigned){

                const teacherExist =  await this.schoolAdminRepo.teacherExists(id,data)
                if(teacherExist){
                    console.log('is Existing');
                    
                        return {
                            status:409,
                            message:'Teacher Already Exists'
                        }
                        }else{
                            console.log('creating a new teacher ');
                            
            const generatePassword = await this.pwdGen.generateRandomPassword()
            const result = await this.schoolAdminRepo.addTeachers(generatePassword,data,id)
                if(result){
                    console.log('going to send the teacher password');
                    
                    const sendMail = await this.sendPwd.sendPwd(data.name,data.email,generatePassword)
                    if(sendMail)
                   {
                        
                        
                       return {
                           status:200,
                           message:'Faculty assigned with subject successfully'
                       }
                   } 
                }else{
                    return {
                        status:409,
                        message:'Error in adding teacher'
                    }
                }
                        }
            }else{
                

                const teacherExist =  await this.schoolAdminRepo.teacherExists(id,data)
                    if(teacherExist){
                        return {
                            status:409,
                            message:'Subject is already assigned to another Faculty and teacher already exists.'
                        }
                    }else{

                        return {
                            status :409,
                            message:'Subject already assigned to a Faculty. Please Update the Credentials '
                        }
                    //    const generatePassword = await this.pwdGen.generateRandomPassword()
                    //     const createTeacher = await this.schoolAdminRepo.teacherUnassigned(id,generatePassword,data)
                    //     if(createTeacher){

                    //     }
                    }
                
            }
        //     if(teacherExist){
        //         if(status.status == 407){
        //             return {
        //                 status:409,
        //                 message:'Subject already assigned to another faculty in the class.'
        //             }
        //         }else if(status.status == 409){

        //         }
        //         else{
        //             return {
        //                 status:200,
        //                 message:'Subject added Successfully'
        //             }
        //         }
        //     }else{
        //     
        //     const generatePassword = await this.pwdGen.generateRandomPassword()
        //     const result = await this.schoolAdminRepo.addTeachers(generatePassword,data,id)
        //         if(result){
        //             return {
        //                 status:200,
        //                 message:'Subject added successfully'
        //             }
        //         }else{
        //             return {
        //                 status:409,
        //                 message:'Error in adding teacher'
        //             }
        //         }
        // }
        
        
        
        
    } catch (error) {
        console.log('Internal error ');
        return {
            status:500,
            message:'Please try again after sometime '
        }
        
    }

}

async fetchClasses(id:string){
    try {
        const data= await this.schoolAdminRepo.fetchClasses(id)
        
        
        if(data){

            const result = await modifyData(data)
            
            
            return{
                status:200,
                data:{
                    array:result
                }
            }
        }else{
            return {
                status:500,
                message:'Try again after sometime'
            }
        }
    } catch (error) {
        console.log(error);
        
    }
}

async fetchTeacherData(id:string){
    try {
        const data = await this.schoolAdminRepo.fetchTeacherData(id) 
        if(data){

            return {
                status:200,
                data:data
            }
        }else {
            return{
                status:400,
                data:null
            } 
        }
    } catch (error) {
        
        
        return {
            status:500,
            data:null
        }
    }
}

}
export default schoolAdminUseCase