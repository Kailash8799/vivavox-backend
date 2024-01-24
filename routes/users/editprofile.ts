require('dotenv').config()
import express from 'express'
import User from '../../models/User';
import Profile from '../../models/Profile';
import { queryUpdateData } from '../../constants/methods/queryupdatedata';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET

router.post("/", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { profile, email } = req.body;
        const query = await queryUpdateData(profile);
        console.log(query)
        const olduser = await Profile.findOne({email});
        if (olduser === null || olduser === undefined) {
            res.json({ success: false, message: "Invalid session please logout and login again!" });
            return;
        }
        const u = await User.updateOne({ email }, query);
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