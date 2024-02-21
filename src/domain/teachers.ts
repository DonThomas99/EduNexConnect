export interface teachers{
name:string;
email:string;

password:string;
classNsub:[{
    classNum:string;
    subject:string[];
}]
}
export interface Iteachers{
    email:string;
    name:string;
    class:string;
    subject:string;

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