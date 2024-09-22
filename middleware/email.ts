require('dotenv').config()
import nodemailer from 'nodemailer'
import { SendMailProps } from '../constants/props/email';

const sendMail = async ({ to_email, htmlemail, subject }: SendMailProps) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: to_email,
            subject: subject,
            html: htmlemail,
        };

        const server = await new Promise((resolve, reject) => {
            // verify connection configuration
            transporter.verify(function (error, success) {
                if (success) {
                    resolve(success);
                }
                reject(error);
            });
        });
        if (!server) {
            console.log("server : " + server);
            return false;
        }

        const success = await new Promise((resolve, reject) => {
            // send mail
            transporter.sendMail(mailOptions).then((info, err) => {
                if (info.response.includes("250")) {
                    resolve(true);
                }
                console.log("***")
                console.log(err)
                reject(err);
            });
        });

        if (!success) {
            return false;
        }
        return true;


    } catch (error) {
        console.log(error)
        return false;
    }
}

export default sendMail;