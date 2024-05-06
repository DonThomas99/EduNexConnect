import schoolAdminUseCase from "../use_case/schoolAdminUseCase"
import { Request, Response } from "express"


class schoolAdminController {
    private schoolAdminCase: schoolAdminUseCase
    constructor(
        schoolAdminCase: schoolAdminUseCase
    ) {
        this.schoolAdminCase = schoolAdminCase
    }

    async fetchSummary(req: Request, res: Response) {
        try {
            const id = req.body.id
            console.log(id);

            const response = await this.schoolAdminCase.fetchSummary(id)
            if (response) {
                res.status(response.status).json({ studentsCount: response.studentCount, teacherCount: response.teacherCount })
            }
        } catch (error) {
            console.log(error);

        }
    }

    async schoolAdminLogin(req: Request, res: Response) {
        try {
            console.log('body:', req.body);
            const { name, password, id } = req.body
            const result = await this.schoolAdminCase.login(name, password, id)
            if (result) {
                console.log('hdsd');

                return res.status(result.status).json(result.data)
            }
        } catch (error) {
            console.log(error);

        }
    }

    //Class and Subjects CRUD operations


    async addSubject(req: Request, res: Response) {
        try {
            const { classNumber, subject, id } = req.body
            const result = await this.schoolAdminCase.addSubjects(classNumber, subject, id)
            if (result)
                res.status(result.status).json(result.data)
        } catch (error) {
            console.log(error);

        }
    }
    async deleteSubject(req: Request, res: Response) {
        try {
            const { classNum, subject, id } = req.body
            const result = await this.schoolAdminCase.deleteSubject(id, classNum, subject)
            return res.status(result.status).json(result.message)

        } catch (error) {

        }
    }
    async fetchClasses(req: Request, res: Response) {
        try {
            const id = req.body.id as unknown as string
            const response = await this.schoolAdminCase.fetchClasses(id)
            if (response) {

                res.status(response.status).json(response.data)
            }
        } catch (error) {
            console.log(error);

        }
    }
    async updateSubjects(req: Request, res: Response) {
        try {

            const { id, classNum, subjectId } = req.body
            console.log(req.body);

            const subjectName = req.body.subjectName.subjectName
            const response = await this.schoolAdminCase.updateSubject(id, subjectName, classNum, subjectId)
            if (response) {
                res.status(response.status).json({ message: response.message })
            } else {
                res.status(500).json({ message: 'Error Updating Status' })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error Updating Status' })
        }
    }


    //Teachers CRUD operations


    async addSubjectToTeacher(req: Request, res: Response) {
        try {
            const { teacherEmail, classNum, subjectId, subjectName, id } = req.body
            const added = await this.schoolAdminCase.addSubToTeacher(id, teacherEmail, classNum, subjectId, subjectName)
            if (added) {
                res.status(added.status).json(added.message)
            }

        } catch (error) {
            console.log(error);

        }
    }
    async addTeacher(req: Request, res: Response) {
        try {
            const { id, data } = req.body
            const response = await this.schoolAdminCase.addTeacher(data, id)
            if (response) {
                console.log('response from backend', response);

                return res.status(response.status).json(response.message)
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error Please try Later!!!' })

        }
    }
    async fetchTeacherData(req: Request, res: Response) {
        try {
            const id = req.body.id as unknown as string
            const response = await this.schoolAdminCase.fetchTeacherData(id)

            if (response) {
                res.status(response.status).json(response.data)
            }
        } catch (error) {
            console.log('controller error', error);

        }
    }

    async toggleBlock(req: Request, res: Response) {
        try {
            const { email, id } = req.body
            console.log('in the controller');

            const response = await this.schoolAdminCase.toggleBlock(email, id)
            return res.status(response.status).json(response.message)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error Changing Status!!!' })

        }
    }

    async updateTeacherData(req:Request,res:Response){
        try {
               const {data,teacherId,id} = req.body
               const response = await this.schoolAdminCase.updateTeacherData(data,id,teacherId)
               if(response){
                   res.status(response.status).json({message:response.message})
               } else{
            res.status(500).json({message:'Error Updating Teacher'})
               }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error Updating Teacher'})
        }
    }

    async removeSubject(req:Request,res:Response){
        try {
            const {id,teacherId,classNum,subjectId} = req.body
            const response = await this.schoolAdminCase.removeSubject(id,teacherId,classNum,subjectId)
            if(response){
                res.status(response.status).json({message:response.message})
            } else{
            res.status(500).json({message:'Error Deleting Subject'})

            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error Deleting Subject'})
        }
    }

    //Student CRUD operations 


    async addStudent(req: Request, res: Response) {
        try {
            const {

                name,
                email,
                gaurdianName,
                mobile,
                classNum,

            } = req.body.student
            // console.log(req.body);
            // const student= req.body.student
            const id = req.body.id as unknown as string

            const response = await this.schoolAdminCase.addStudent(id, name, email, gaurdianName, mobile, classNum)
            if(response)             
            return res.status(response.status).json({messge:response.message})
        } catch (error) {
            console.log(error);
        }
    }

    async fetchStudents(req: Request, res: Response) {
        try {
            const id = req.body.id as unknown as string
            const response = await this.schoolAdminCase.fetchStudents(id)
            if (response) {
                res.status(response.status).json(response.data)
            }
        } catch (error) {
            console.log(error);

        }
    }

    async updateStudent(req:Request,res:Response){
        try {
            const {studentId,id} = req.body
            const data = req.body.data
            const response = await this.schoolAdminCase.updateStudent(id,studentId,data)
            if(response){
                res.status(response.status).json({message:response.message})
            }else{
            res.status(500).json({message:'Error Updating Student'})
            }            
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error Updating Student'})
            
        }
    }

    async deleteStudent(req:Request,res:Response){
        try {
            const {studentId,id} = req.body
            console.log(studentId,id);
            const response = await this.schoolAdminCase.deleteStudent(id,studentId)
            if(response){
                res.status(response.status).json({message:response.message})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Error Removing Student '})
            
        }
    }

}

export default schoolAdminController