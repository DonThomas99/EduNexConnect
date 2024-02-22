import nodemailer from 'nodemailer'
import Inodemailer from '../../use_case/interface/nodemailerInterface'
import dotenv from 'dotenv'
dotenv.config()
class sendOtp{
    private transporter : nodemailer.Transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'edunexconnect@gmail.com',
                pass: process.env.EMAIL_PASS,
            },
        })
    }

    sendMail(name:string,email:string, verif_code:string):void{
        const mailOptions :nodemailer.SendMailOptions = {
                from: 'edunexconnect@gmail.com',
                to:email,
                subject:'EduNexConnect Email Verification',
                text: `${name},your verification code is: ${verif_code}.`
        }
        this.transporter.sendMail(mailOptions,(err)=>{
            if (err){
                console.log(err);
                
            }else{
                console.log('verification code sent successfully');
                
            }
        })
    }

   async sendPwd(name:string,email:string,password:string):Promise<boolean>{
    try {
        
        const mailOptions : nodemailer.SendMailOptions ={
            from:'edunexconnect@gmail.com',
            to:email,
            subject:'Faculty Password',
            text:`Dear ${name}, ${password} is your Password for the school website with ${email}.`
        } 
        this.transporter.sendMail(mailOptions,(err)=>{
            if(err){
                console.log('sending password failed'); 
                return false
            }else{
                return true
            }
        })
        return true
    } catch (error) {
        return false
    }
   }
}

export default sendOtp
