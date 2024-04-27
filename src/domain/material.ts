export interface Imaterial{
        subjectId:string,
        content:string,
        materialTitle:string,
        pdf:string
}
export interface IAssignment{
        subjectId:string,
        teacherId:string,
        content:string,
        assignmentTitle:string,
        pdf:string,
       submissionDate:Date,
        
}

export interface Assignment{
        assignmentTitle?:string,
        content?:string,
        submissionDate?:string,
}