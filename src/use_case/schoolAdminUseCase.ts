import schoolAdminRepo from '../infrastructure/repository/schoolAdminRepo'
import JwtCreate from '../infrastructure/utils/jwtCreate';
import modifyData from '../infrastructure/utils/dataTransform'
import { Iteachers, teachers } from '../domain/teachers';
import passwordGenerator from '../infrastructure/utils/passwordGenerator';
import sendOtp from '../infrastructure/utils/sendMail';
import { Istudent } from '../domain/Student';


class schoolAdminUseCase {

    constructor(
        private readonly pwdGen: passwordGenerator,
        private readonly schoolAdminRepo: schoolAdminRepo,
        private readonly JwtCreate: JwtCreate,
        private readonly sendPwd: sendOtp


    ) {

    }

    async login(name: string, password: string, id: string) {
        try {


            const document = await this.schoolAdminRepo.findById(id, name);


            if (document) {


                if (password === document.password) {
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

    async fetchSummary(id: string) {
        try {
            const studentCount = await this.schoolAdminRepo.fetchStudentCount(id)
            const teacherCount = await this.schoolAdminRepo.fetchTeacherCount(id)
            console.log(teacherCount, studentCount);
            return {
                status: 200,
                teacherCount: teacherCount,
                studentCount: studentCount
            }

        } catch (error) {
            console.log(error);

        }
    }

    //-------------------------Subject and Class CRUD Operations------------------------------------------------------
    async fetchClasses(id: string) {
        try {
            const data = await this.schoolAdminRepo.fetchClasses(id)


            if (data) {

                // const result = await modifyData(data)


                return {
                    status: 200,
                    data: {
                        array: data
                    }
                }
            } else {
                return {
                    status: 500,
                    message: 'Try again after sometime'
                }
            }
        } catch (error) {
            console.log(error);

        }
    }
    async addSubjects(classNumber: string, subject: string, id: string) {
        try {
            const status = await this.schoolAdminRepo.subjectExists(subject, classNumber, id)

            if (!status) {
                const documentToInsert = {
                    class: classNumber,
                    subjects: [
                        {
                            name: subject,
                            roomId: ""
                        }
                    ]
                }
                const save = await this.schoolAdminRepo.addSubject(classNumber, subject, documentToInsert, id)
                if (save) {
                    return {
                        status: 200,
                        data: {
                            message: 'subject added Successfully!!! '
                        }
                    }
                } else {
                    return {
                        status: 500,
                        data: {
                            message: 'Subject addition failed. Please try again later'
                        }
                    }
                }

            } else {
                return {
                    status: 500,
                    data: {
                        message: 'Please try again later.'
                    }
                }
            }


        } catch (error) {
            console.log(error);

        }
    }
    async deleteSubject(id: string, classNum: string, subject: string) {
        try {
            const isDeleted = await this.schoolAdminRepo.deleteSubject(id, classNum, subject)
            if (isDeleted) {
                return {
                    status: 200,
                    message: 'subject Deleted Successfully '
                }
            } else {
                return {
                    status: 409,
                    message: 'Error Deleting subject!!'
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: 'Technical Error. Please try after sometime'
            }
        }
    }
    async updateSubject(id: string, newSubject: string, classNum: string, subjectId: string) {
        try {
            const updateStatus = await this.schoolAdminRepo.updateSubject(id, classNum, newSubject, subjectId)
            if (updateStatus) {
                return {
                    status: 200,
                    message: 'Subject Updated Successfully'
                }
            } else {
                return {
                    status: 409,
                    message: 'Error Updating Subject'
                }
            }
        } catch (error) {
            console.log(error);
            return {
                status: 409,
                message: 'Error Updating Subject in Class'
            }

        }
    }
    //---------------------------Teacher UseCase----------------------------------------------------------------

    async addSubToTeacher(id: string, teacherEmail: string, classNum: string, subjectId: string, subjectName: string) {
        try {

            const document = {
                email: teacherEmail,
                name: 'undefined',
                class: classNum,
                subjectId: subjectId,
                subjectName: subjectName
            }
            const isAssigned = await this.schoolAdminRepo.isSubjectAssignedToAnotherFaculty(id, document)
            if (!isAssigned) {

                const isAdded = await this.schoolAdminRepo.addSubToTeacher(id, teacherEmail, classNum, subjectId, subjectName)
                if (isAdded) {
                    return {
                        status: 200,
                        message: 'Subject added Successfully'
                    }
                } else {

                    return {
                        status: 409,
                        message: 'Error Occured!!!. Please Try Again Later'
                    }
                }

            } else {
                return {
                    status: 409,
                    message: 'Subject Already Assigned!!!.'
                }
            }

        } catch (error) {
            console.log(error);

        }
    }

    async addTeacher(data: Iteachers, id: string) {
        try {
            const isAssigned = await this.schoolAdminRepo.isSubjectAssignedToAnotherFaculty(id, data)
            if (!isAssigned) {

                const teacherExist = await this.schoolAdminRepo.teacherExists(id, data)
                if (teacherExist) {
                    console.log('is Existing');

                    return {
                        status: 409,
                        message: 'Teacher Already Exists'
                    }
                } else {
                    console.log('creating a new teacher ');

                    const generatePassword = await this.pwdGen.generateRandomPassword()
                    const result = await this.schoolAdminRepo.addTeachers(generatePassword, data, id)
                    if (result) {
                        console.log('going to send the teacher password');

                        const sendMail = await this.sendPwd.sendPwd(data.name, data.email, generatePassword)
                        if (sendMail) {


                            return {
                                status: 200,
                                message: 'Faculty assigned with subject successfully'
                            }
                        }
                    } else {
                        return {
                            status: 409,
                            message: 'Error in adding teacher'
                        }
                    }
                }
            } else {


                const teacherExist = await this.schoolAdminRepo.teacherExists(id, data)
                if (teacherExist) {
                    return {
                        status: 409,
                        message: 'Subject is already assigned to another Faculty and teacher already exists.'
                    }
                } else {

                    return {
                        status: 409,
                        message: 'Subject already assigned to a Faculty. Please Update the Credentials '
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
                status: 500,
                message: 'Please try again after sometime '
            }

        }

    }

    async fetchTeacherData(id: string) {
        try {
            const data = await this.schoolAdminRepo.fetchTeacherData(id)
            if (data) {

                return {
                    status: 200,
                    data: data
                }
            } else {
                return {
                    status: 400,
                    data: null
                }
            }
        } catch (error) {


            return {
                status: 500,
                data: null
            }
        }
    }

    async toggleBlock(email: string, id: string) {
        try {
            console.log('in the usecase');

            const result = await this.schoolAdminRepo.toggleBlock(email, id)
            if (result.modifiedCount == 1) {
                return {
                    status: 200,
                    message: 'Status Changed successfully'
                }
            } else {
                return {
                    status: 409,
                    message: 'Unable to change status'
                }
            }

            // console.log(result);


        } catch (error) {
            return {
                status: 500,
                message: 'Error Occured Try Again Later!!!'
            }
        }
    }

    async updateTeacherData(data:Partial<teachers>,id:string,teacherId:string){
        try {
            const updateStatus = await this.schoolAdminRepo.updateTeachers(id,teacherId,data)
            if(updateStatus){
                return {
                    status:200,
                    message:'Teacher Data Updated Successfully '
                }
            } else{
                return {
                    status:409,
                    message:'Error Updating Teacher'
                }
            }
        } catch (error) {
            console.log(error);
            return{
                status:500,
                message:'Error Updating Teacher'
            }
            
        }
    }

    async removeSubject(id:string,teacherId:string,classNum:string,subjectId:string){
        try {
            const updateStatus = await this.schoolAdminRepo.removeSubject(id,teacherId,classNum,subjectId)
        } catch (error) {
            console.log(error);
            return {
                status:200,
                message:'Error Deleting a Subject'
            }
        }
    }

    //-----------------------------Student UseCase---------------------------------------------------------------

    async addStudent(id: string, name: string, email: string, gaurdianName: string, mobile: string, classNum: string) {
        try {
            const isExist = await this.schoolAdminRepo.studentExists(id, email)
            if (isExist) {
                return {
                    status: 409,
                    message: 'Student Already Exists'
                }
            } else {
                const password = await this.pwdGen.generateRandomPassword()
                const student = {
                    name: name,
                    email: email,
                    gaurdianName: gaurdianName,
                    mobile: mobile,
                    classNum: classNum,
                    password: password,
                }
                const isStudentAdded = await this.schoolAdminRepo.addStudent(id, student)
                if (isStudentAdded) {
                    const sendMail = await this.sendPwd.sendStudentPwd(name, email, password)
                    if (sendMail) {

                        return {
                            status: 200,
                            message: 'Student Added Successfully!!'
                        }
                    }
                } else {
                    return {
                        status: 409,
                        message: 'Student Enrolling Failed Please Try!!!'
                    }
                }
            }

        } catch (error) {
            return {
                status: 500,
                message: 'Server Error !!! Try Again Later!!!'
            }

        }
    }


    async fetchStudents(id: string) {
        try {
            const data = await this.schoolAdminRepo.fetchStudents(id)
            if (data) {
                return {
                    status: 200,
                    data: data,
                    message: 'data fetched successfully'
                }
            } else {
                return {
                    status: 400,
                    data: null,
                    message: 'Error fetching Data'
                }
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: 'Error fetching data'
            }
        }
    }

}
export default schoolAdminUseCase