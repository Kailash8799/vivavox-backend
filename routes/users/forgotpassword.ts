require('dotenv').config()
import express from 'express'
import User from '../../models/User';
import jwt, { JwtPayload } from "jsonwebtoken";
import sendMail from '../../middleware/email';
import CryptoJS from "crypto-js";
import { forgotpasswordemailtemp } from '../../constants/template/forgotemail';
const router = express.Router();

router.post("/sendemail", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { email } = req.body;
        if (email === undefined) {
            res.json({ success: false, message: "Email not valid" });
            return;
        }
        const olduser = await User.findOne({ email });
        if (!olduser) {
            res.json({ success: false, message: "No user found with this email" });
            return;
        }
        const token = jwt.sign({ email: olduser?.email }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: "HS384" });
        const htmlemail = await forgotpasswordemailtemp(token);
        const email_responce = await sendMail({ htmlemail: htmlemail, subject: "Reset password", to_email: email })
        if (email_responce) {
            res.json({ token, success: true, message: "Email sent successfully" });
            return;
        } else {
            res.json({ success: false, message: "Some error occured! while sending email" });
            return;
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" }).status(401);
        return;
    }
})
router.post("/resetpassword", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { password, token } = req.body;
        if (password === undefined || token === undefined) {
            res.json({ success: false, message: "token is invalid" });
            return;
        }
        const { email } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        if (email === undefined) {
            res.json({ success: false, message: "token is invalid" });
            return;
        }
        const olduser = await User.findOne({ email });
        if (!olduser) {
            res.json({ success: false, message: "No user found with this email" });
            return;
        }
        const hashPassword = CryptoJS.AES.encrypt(password, process.env.PASSWORD_KEY).toString();
        await User.findOneAndUpdate({ email: email }, { password: hashPassword });
        res.json({ success: true, message: "Password updated successfully!" });
        return;

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "token is invalid" }).status(401);
        return;
    }
})

export default router