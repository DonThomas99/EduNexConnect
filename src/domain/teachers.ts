export interface teachers{
name:string;
email:string;
userId:string;
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