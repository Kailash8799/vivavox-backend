require('dotenv').config()
import express from 'express'
import User from '../../models/User';
import jwt, { JwtPayload } from "jsonwebtoken";
import sendMail from '../../middleware/email';
import { verifyemail } from '../../constants/template/verifyemail';
import CryptoJS from "crypto-js";
const router = express.Router();

router.post("/sendemail", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { email, password } = req.body;
        if (email === undefined || password === undefined) {
            res.json({ success: false, message: "Email not valid" });
            return;
        }
        const olduser = await User.findOne({ email });
        if (!olduser) {
            res.json({ success: false, message: "No user found with this email" });
            return;
        }
        var cypherpassword = CryptoJS.AES.decrypt(olduser?.password, process.env.PASSWORD_KEY);
        var originalpassword = cypherpassword.toString(CryptoJS.enc.Utf8);
        if (originalpassword !== password) {
            res.json({ success: false, message: "Invalid credentials" });
            return;
        }
        if (olduser?.emailVerified) {
            res.json({ success: false, message: "Email already verified!" });
            return;
        }
        const token = jwt.sign({ email: olduser?.email, success: true }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: "HS384" });
        const htmlemail = await verifyemail(token);
        const email_responce = await sendMail({ htmlemail: htmlemail, subject: "Account Verification", to_email: email })
        if (email_responce) {
            res.json({ token, success: true, message: "Verification email sent successfully" });
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

router.post("/verify", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { token } = req.body;
        if (token === undefined) {
            res.json({ success: false, message: "token not valid" });
            return;
        }
        const { email } =  jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        if (email === undefined) {
            res.json({ success: false, message: "token not valid" });
            return;
        }
        const olduser = await User.findOne({ email });
        if (!olduser) {
            res.json({ success: false, message: "token is not valid" });
            return;
        }
        if (olduser?.emailVerified) {
            res.json({ success: false, message: "Email already verified!" });
            return;
        }
        await User.findOneAndUpdate({ email: email }, { emailVerified: true });
        res.json({ success: true, message: "Email verified!" }).status(401);
        return;
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "token is invalid" }).status(401);
        return;
    }
})

export default router