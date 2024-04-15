import {v2 as cloudinary} from 'cloudinary';
import cloudinaryInterface from '../../use_case/interface/cloudinaryInterface';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY , 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

class Cloudinary implements cloudinaryInterface{
    async savetoCloudinary(file:any): Promise<string | null>{
        try {
            const maxBytes = 10485760
            if(file.size >maxBytes){
                throw new Error("File sie too large, Maximum is 10MB")
            }
            const result = await cloudinary.uploader.upload(file?.path,{
                resource_type:'auto',
                quality_auto:'best',
            })
            return result.secure_url
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async removeFromCloudinary(publicId:string): Promise<boolean | null>{
        try {
            const status = await cloudinary.uploader.destroy(publicId)
                console.log(status);
                
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
}
export default Cloudinary