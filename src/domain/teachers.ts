export interface teachers{
name:string;
email:string;
password:string;
isBlocked:boolean;
classNsub:[{
    classNum:string;
    subject:SubjectsDoc[];
}]
}
export interface Iteachers{
    email:string;
    name:string ;
    class:string;
    subjectId:string;
    subjectName:string;
}
export interface classNsub{
    classNum:string;
    subject:string[];
}

export interface unAssignedTeacher{
    name:string;
    email:string;
    password:string;
}

export interface SubjectsDoc{
    name:string,
    Id:string
  }