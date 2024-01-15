require('dotenv').config()
import express from 'express'
import User from '../../models/User';
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { email, password } = req.body;
        if (email === undefined || password === undefined) {
            res.json({ success: false, message: "Invalid credentials" });
            return;
        }
        const olduser = await User.findOne({ email });
        if (!olduser) {
            res.json({ success: false, message: "Invalid credentials" });
            return;
        }
        if (!(olduser?.emailVerified)) {
            res.json({ success: false, message: "Email not verified!" });
            return;
        }
        var cypherpassword = CryptoJS.AES.decrypt(olduser?.password, process.env.PASSWORD_KEY);
        var originalpassword = cypherpassword.toString(CryptoJS.enc.Utf8);
        if (originalpassword !== password) {
            res.json({ success: false, message: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ name: olduser?.username, email: olduser?.email, gender: olduser?.gender, location: olduser?.location, premiumuser: olduser?.premiumuser, interest: olduser?.interest }, process.env.JWT_SECRET, { expiresIn: '10d', algorithm: "HS384" });

        res.json({token, success: true, message: "Login Successfull"});

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" }).status(401);
        return;
    }
})

export default router