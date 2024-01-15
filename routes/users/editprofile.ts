require('dotenv').config()
import express from 'express'
import User from '../../models/User';
import jwt, { JwtPayload } from "jsonwebtoken";
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET

router.post("/", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { username, age, gender, location, interest, token } = req.body;
        const decode = jwt.verify(token, JWT_SECRET);
        const { email } = decode as JwtPayload;
        const olduser = await User.findOne({ email });
        if (olduser === null || olduser === undefined) {
            res.json({ success: false, message: "Invalid session please logout and login again!" });
            return;
        }
        const u = await User.updateOne({ email }, { username, location, interest });
        if (!u) {
            res.json({ success: false, message: "Some error occured updating profile!" });
            return;
        }
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})

export default router