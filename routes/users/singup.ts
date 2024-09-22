require('dotenv').config()
import express from 'express'
import User from '../../models/User';
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import sendMail from '../../middleware/email';
import { verifyemail } from '../../constants/template/verifyemail';
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (username === "" || email === "" || password === "" || username === undefined || email === undefined || password === undefined) {
            res.json({ success: false, message: "All fields are required!" });
            return;
        }

        const olduser = await User.findOne({ email });
        if (olduser) {
            res.json({ success: false, message: "User already exits" });
            return;
        }
        const hashPassword = CryptoJS.AES.encrypt(password, process.env.PASSWORD_KEY).toString();

        const newuser = new User({
            username: username,
            email: email,
            password: hashPassword,
            emailVerified: false,
        })

        const u = await newuser.save();
        if (!u) {
            res.json({ success: false, message: "Some error occured while creating account!" });
            return;
        }
        const token = jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: "HS384" });
        const htmlemail = await verifyemail(token);
        const email_responce = await sendMail({ htmlemail: htmlemail, subject: "Account Verification", to_email: email })
        res.json({ success: true, message: email_responce });
        return;
        if (email_responce) {
        } else {
            await User.deleteOne({ email: email });
            res.json({ success: false, message: "Some error occured while creating account!" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})

export default router