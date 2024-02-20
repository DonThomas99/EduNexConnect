export  interface Subject {
    class: string;
    subjects: SubjectName[];
  }
  
  interface SubjectName {
    name: string;
  }
  
  export  interface classNsubjects{
    classNumber:string,
    subjects:string[]
  }