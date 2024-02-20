import { classNsubjects } from "../../domain/subjectInterface";
import { Subject } from '../../domain/subjectInterface';

async function modifyData(backendData: Subject[]) {
    try {
        const transformedData: classNsubjects[] = backendData.map((item: any) => {
            return {
                classNumber: item.class,
                subjects: item.subjects.map((subject: any) => subject.name)
            };
        });
        return transformedData; // Return the transformed data
    } catch (error) {
        console.error("Error in modifying data:", error);
        throw error; // Rethrow the error for handling at a higher level
    }
}
export default modifyData