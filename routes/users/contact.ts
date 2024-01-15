require('dotenv').config()
import express from 'express'
import Contact from '../../models/Contact';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

router.post("/", async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.json({ success: false, message: "Some error occured!" });
            return;
        }
        const { firstname, lastname, email, subject, message, token } = req.body;
        const decode = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        const { email: emailjwt } = decode;
        const olduser = await User.findOne({ email: emailjwt });
        if (olduser === null || olduser === undefined) {
            res.json({ success: false, message: "Invalid session please logout and login again!" });
            return;
        }
        console.log(olduser)

        const contact = new Contact({
            userId: olduser._id,
            firstname,
            lastname,
            email,
            subject,
            message
        })
        const u = await contact.save();
        if (!u) {
            res.json({ success: false, message: "Some error occured while sending messages!" });
            return;
        }
        res.json({ success: true, message: "Message sended successfully!" });
        return;

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Some error occured!" });
        return;
    }
})

export default router