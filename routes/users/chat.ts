require('dotenv').config()
import express from 'express'
// import mongoose from 'mongoose';
import Profile from '../../models/Profile';
const router = express.Router();

router.post("/createchat", async (req, res) => {
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

        // if (!u || !uremote) {
        //     res.json({ success: false, message: "Some error occured updating profile!" });
        //     return;
        // }
        res.json({ success: true, message: "Chat created" }).status(200);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})

router.post("/deletechat", async (req, res) => {
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
        // if (!u) {
        //     res.json({ success: false, message: "Some error occured updating profile!" });
        //     return;
        // }
        res.json({ success: true, message: "Profile updated successfully" }).status(200);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})

export default router