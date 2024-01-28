require('dotenv').config()
import express from 'express'
import Profile from '../../models/Profile';
import { queryUpdateData } from '../../constants/methods/queryupdatedata';
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { profile, email } = req.body;
        const query = await queryUpdateData(profile);
        const olduser = await Profile.findOne({ email });
        if (olduser === null || olduser === undefined) {
            res.json({ success: false, message: "Invalid session please logout and login again!" });
            return;
        }
        const u = await Profile.findOneAndUpdate({ email }, query, {
            new: true,
        }).select('-__v').select('-createdAt').select("-updatedAt");
        if (!u) {
            res.json({ success: false, message: "Some error occured updating profile!" });
            return;
        }
        res.json({ success: true, message: "Profile updated successfully", profile: u }).status(200);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})

export default router