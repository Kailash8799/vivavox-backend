require('dotenv').config()
import express from 'express'
// import mongoose from 'mongoose';
import Profile from '../../models/Profile';
import Chat from '../../models/Chat';
import Message from '../../models/Message';
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

        const chatexist = await Chat.findOne({ $or: [{ userid: olduser._id, remoteuser: remoteuser._id }, { userid: remoteuser._id, remoteuser: olduser._id }] });
        if (chatexist !== null) {
            res.json({ success: false, message: "Chat already created!" });
            return;
        }

        const newchat = await Chat.create({
            userid: olduser._id,
            remoteuser: remoteuser._id
        });
        if (newchat) {
            res.json({ success: true, message: "Chat created" }).status(200);
            return;
        }
        res.json({ success: false, message: "Some error while creating chat" }).status(200);
        return;
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})

router.post("/addmessage", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { chat, sender, message } = req.body;


        const newmessage = await Message.create({
            chat,
            sender,
            message,
        });

        if (newmessage) {
            await Chat.findOneAndUpdate({ _id: chat }, { latestMessage: newmessage._id }, { new: true });
            res.json({ success: true, message: "Chat created", newmessage: newmessage }).status(200);
            return;
        }

        res.json({ success: false, message: "Some error while creating chat" }).status(200);
        return;
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})

router.post("/getallchat", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { email } = req.body;

        const olduser = await Profile.findOne({ email });
        if (olduser === null || olduser === undefined) {
            res.json({ success: false, message: "Invalid session please logout and login again!" });
            return;
        }

        const chatexist = await Chat.find({ $or: [{ userid: olduser._id }, { remoteuser: olduser._id }] }).select('-__v').select('-createdAt').select("-updatedAt").populate({
            path: 'userid',
            model: 'Profile',
            select: '_id profileimage username email premiumuser',
        }).populate({
            path: 'remoteuser',
            model: 'Profile',
            select: '_id profileimage username email premiumuser',
        }).populate({
            path: 'latestMessage',
            model: 'Message',
            select: '_id chat sender message createdAt',
        });

        res.json({ success: true, message: "Chat fetched successfully", allchat: chatexist }).status(200);
        return;
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!", allchat: [] });
        return;
    }
})
router.post("/getallmessage", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { chatid } = req.body;
        console.log(chatid)

        const allmessage = await Message.find({ chat: chatid }).sort({ createdAt: -1 });

        res.json({ success: true, message: "Chat fetched successfully", allchatmessages: allmessage }).status(200);
        return;
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!", allchatmessages: [] });
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