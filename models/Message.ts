import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);