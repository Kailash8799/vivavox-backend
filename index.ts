require('dotenv').config()
import express from "express";
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import loginModule from './routes/users/login'
import signupModule from './routes/users/singup'
import forgotModule from './routes/users/forgotpassword'
import verifyuserModule from './routes/users/verifyuser'
import contactuserModule from './routes/users/contact'
import editprofileModule from './routes/users/editprofile'
import getprofileModule from './routes/users/getprofile'
import getAllprofileModule from './routes/users/getallprofile'
import updateprofileimageModule from './routes/users/uploadimage'
import uploadimageModule from './routes/users/addimages'
import likedislikeModule from './routes/users/likedislike'
import chatroomModule from './routes/users/chat'
import welcomeModule from './routes/default/welcome'
import connectDb from "./middleware/_db";

const PORT = process.env.PORT || 5500;
const app = express();
const server = createServer(app);
const io = new Server(server
    // , { pingInterval: 60000, cors: { origin: "*" } }
);

connectDb();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use("/", welcomeModule)
app.use("/v1/users/signin", loginModule);
app.use("/v1/users/signup", signupModule);
app.use("/v1/users/forgot", forgotModule);
app.use("/v1/users/verifyemail", verifyuserModule);
app.use("/v1/users/contact", contactuserModule);
app.use("/v1/users/editprofile", editprofileModule);
app.use("/v1/users/getprofile", getprofileModule);
app.use("/v1/users/getallprofile", getAllprofileModule);
app.use("/v1/users/updateprofileimage", updateprofileimageModule);
app.use("/v1/users/uploadimage", uploadimageModule);
app.use("/v1/users/likedislike", likedislikeModule);
app.use("/v1/users/chatroom", chatroomModule);

io.on("connection", (socket) => {
    console.log("user joined to socket successfully")
    socket.on("join room", (roomId: string) => {
        socket.join(roomId);
    })

    socket.on("new message", (data) => {
        console.log(data.roomId)
        socket.broadcast.to(data.roomId).emit("new message", data.message);
    });
    socket.on("disconnect", () => {
        console.log(socket.id + " disconected");
    })
});

server.listen(PORT, () => {
    console.log(`Server is ready ${PORT} at ${process.env.EMAIL} and ${process.env.EMAIL_PASSWORD}`);
    console.log(`Server is ready ${PORT}`);
})