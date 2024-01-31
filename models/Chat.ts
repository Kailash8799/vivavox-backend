import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    remoteuser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
}, { timestamps: true })

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);