export default class formatResponse{
    async generateFormattedResponse(data:string[],count:number):Promise<{ Mat: string[]; count: number; }> {
        return {
            Mat:data,
            count:count
        }
    }
}