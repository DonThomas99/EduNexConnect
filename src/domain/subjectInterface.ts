export  interface Subject {
    class: string;
    subjects: SubjectName[];
  }
  
  export interface SubjectName {
    _id:string;  
    name: string;
    roomId:string;
  }
  
  export  interface classNsubjects{
    classNumber:string,
    subjects:string[]
  }

  export interface ISubject {
    name: string;
    roomId: string;
}


export interface SubjectsDocument {
  class: string;
  subjects: ISubject[];
}