require('dotenv').config()
import express from 'express'
import mongoose from 'mongoose';
import Profile from '../../models/Profile';
const router = express.Router();

router.post("/like", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { id, email, issuperlike, remoteemail } = req.body;

        const olduser = await Profile.findOne({ email });
        if (olduser === null || olduser === undefined) {
            res.json({ success: false, message: "Invalid session please logout and login again!" });
            return;
        }

        const remoteuser = await Profile.findOne({ _id: id, email: remoteemail });
        if (remoteuser === null || remoteuser === undefined) {
            res.json({ success: false, message: "Remote user not found!" });
            return;
        }

        let allswipe = new Set(olduser?.allswipe);
        const cid = new mongoose.Types.ObjectId(id);
        allswipe.add(cid);
        let allswipearray = Array.from(allswipe);

        const isThere = (olduser?.likes).filter((user: any) => {
            return user.user.toString() === id;
        });

        if (isThere.length > 0) {
            res.json({ success: false, message: "Already liked!" });
            return;
        }

        const query = {
            likes: [...(olduser.likes), { user: id, isSuperlike: issuperlike }],
            allswipe: allswipearray,
        };

        const remotequery = {
            remotelikes: [...(remoteuser.remotelikes),
            { user: olduser._id, isSuperlike: issuperlike }]
        };

        const u = await Profile.findOneAndUpdate({ email }, query, {
            new: true,
        }).select('-__v').select('-createdAt').select("-updatedAt").populate({
            path: 'likes.user',
            model: 'Profile', // Replace with the actual name of your Profile model
        });

        const uremote = await Profile.updateOne({ _id: id, email: remoteemail }, remotequery, {
            new: true,
        });

        if (!u || !uremote) {
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

router.post("/dislike", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { id, email, remoteemail } = req.body;

        const olduser = await Profile.findOne({ email });
        if (olduser === null || olduser === undefined) {
            res.json({ success: false, message: "Invalid session please logout and login again!" });
            return;
        }

        const remoteuser = await Profile.findOne({ _id: id, email: remoteemail });
        if (remoteuser === null || remoteuser === undefined) {
            res.json({ success: false, message: "Remote user not found!" });
            return;
        }

        const isThere = (olduser?.allswipe).filter((swipe) => {
            return swipe.toString() === id;
        });

        if (isThere.length > 0) {
            res.json({ success: false, message: "Already Swiped!" });
            return;
        }

        const cid = new mongoose.Types.ObjectId(id);
        const query = {
            allswipe: [...(olduser?.allswipe), cid]
        };

        const u = await Profile.findOneAndUpdate({ email }, query, {
            new: true,
        }).select('-__v').select('-createdAt').select("-updatedAt").populate("allswipe");

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