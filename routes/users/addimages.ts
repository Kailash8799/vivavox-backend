require('dotenv').config()
import express from 'express'
import Profile from '../../models/Profile';
import multer from 'multer';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
const router = express.Router();

const upload_preset = process.env.UPLOAD_PRESET;
const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;


const options: UploadApiOptions = {
    folder: "vivavox/allimages",
    upload_preset: upload_preset,
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    use_filename: false,
    unique_filename: true,
    overwrite: false,
};

async function deleteImage(imageurl: string, filedestination: string) {
    try {
        const public_id = imageurl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(
            `${filedestination}/${public_id}`, options
        );
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}


router.post("/", multer({ storage: multer.diskStorage({}) }).single("file"), async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        let file = req.file.path;
        console.log(file);
        const { email, oldimages } = req.body;
        const images = JSON.parse(oldimages) as string[];
        if (email === undefined || email === null) {
            res.json({ success: false, message: "Invalid session please logout and try again!" });
            return;
        }
        if (file === null || file === undefined) {
            res.json({ success: false, message: "Invalid file try again!" });
            return;
        }
        const olduser = await Profile.findOne({ email });
        if (olduser === null || olduser === undefined) {
            res.json({ success: false, message: "Invalid session please logout and login again!" });
            return;
        }
        // if (oldimage !== DEFAULT_IMAGE && oldimage !== null && oldimage !== undefined && oldimage !== "null") {
        //     await deleteImage(oldimage, "vivavox/allimages");
        // }
        const result = await cloudinary.uploader.upload(file, options);
        if (result?.public_id !== null && result?.secure_url !== null && result?.secure_url !== undefined) {
            images.push(result?.secure_url)
            const u = await Profile.findOneAndUpdate({ email }, { images: images },
                { new: true }).select('-__v').select('-createdAt').select("-updatedAt");;
            if (!u) {
                res.json({ success: false, message: "Some error occured updating profile!" });
                return;
            }
            res.json({
                success: true, message: "Image updated successfully", profile: u
            });

            return;
        }
        res.json({ success: false, message: "Some error occurred!" }).status(200);
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})


router.post("/delete", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { email, oldimage } = req.body;
        if (email === undefined || email === null) {
            res.json({ success: false, message: "Invalid session please logout and try again!" });
            return;
        }
        const olduser = await Profile.findOne({ email });
        if (olduser === null || olduser === undefined) {
            res.json({ success: false, message: "Invalid session please logout and login again!" });
            return;
        }

        if (oldimage === null || oldimage === undefined || oldimage === "null") {
            res.json({ success: false, message: "Invalid request try again!" });
            return;
        }
        if (oldimage !== DEFAULT_IMAGE) {
            const dres = await deleteImage(oldimage, "vivavox/allimages");
            if (!dres) {
                res.json({ success: false, message: "Error occurred while deleting image! Try agian!" });
                return;
            }
        }
        const images = olduser?.images as string[];
        if (images.length < 1) {
            res.json({ success: false, message: "Error occured!" });
            return;
        }
        const img = images.filter(imgs => imgs !== oldimage);
        const u = await Profile.findOneAndUpdate({ email }, { images: img },
            { new: true }).select('-__v').select('-createdAt').select("-updatedAt");;
        if (!u) {
            res.json({ success: false, message: "Error occurred while deleting image! Try agian!" });
            return;
        }
        res.json({
            success: true, message: "Image removed successfully", profile: u
        });
        return;
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})



export default router