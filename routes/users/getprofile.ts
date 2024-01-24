require('dotenv').config()
import express from 'express'
import jwt, { JwtPayload } from "jsonwebtoken";
import Profile from '../../models/Profile';
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { token } = req.body;
        if (token === undefined || token === null || token === "") {
            res.json({ success: false, message: "token not valid" });
            return;
        }
        const { email } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        if (email === undefined) {
            res.json({ success: false, message: "token not valid" });
            return;
        }
        const userprofile = await Profile.findOne({ email }).select('-__v').select('-createdAt').select("-updatedAt");
        if (!userprofile) {
            res.json({ success: false, message: "token is not valid" });
            return;
        }
        console.log(userprofile);
        res.json({ success: true, message: "Profile",profile:userprofile }).status(200);
        return;
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "token is invalid" }).status(401);
        return;
    }
})

export default router