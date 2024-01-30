require('dotenv').config()
import express from 'express'
import Profile from '../../models/Profile';
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const userprofiles = await Profile.find({ $and: [{ email: { $ne: req.body.email } }, { _id: { $nin: req.body.allswipe } }] }).select('-__v -createdAt -updatedAt');
        // .populate({
            // path: 'likes.user',
            // model: 'Profile',
        // }).populate({
            // path: 'remotelikes.user',
            // model: 'Profile',
        // });

        if (!userprofiles) {
            res.json({ success: false, message: "token is not valid" });
            return;
        }
        res.json({ success: true, message: "Profile", profile: userprofiles }).status(200);
        return;
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "token is invalid" }).status(401);
        return;
    }
})

export default router