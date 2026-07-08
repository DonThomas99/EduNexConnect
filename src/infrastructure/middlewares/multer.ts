import multer from 'multer'
import path from "path"
import fs from "fs"

const storage = multer.diskStorage({
    
    destination:(_req,_file,cb)=>{
        console.log('hjeew')
        const uploadDirectory = path.join(__dirname,"../public")
        if(!fs.existsSync(uploadDirectory)){
        fs.mkdirSync(uploadDirectory,{recursive:true})
        }
        cb(null,uploadDirectory)
    },
    filename:(_req,file,cb)=>{
        cb(null,file.originalname)
    },
})
export const Multer = multer({
    storage:storage
})