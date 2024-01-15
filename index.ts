require('dotenv').config()
import express from "express";
import cors from 'cors'
import { createServer } from 'http'
import bodyParser from 'body-parser';
import loginModule from './routes/users/login'
import signupModule from './routes/users/singup'
import forgotModule from './routes/users/forgotpassword'
import verifyuserModule from './routes/users/verifyuser'
import contactuserModule from './routes/users/contact'
import editprofileModule from './routes/users/editprofile'
import welcomeModule from './routes/default/welcome'
import connectDb from "./middleware/_db";

const PORT = process.env.PORT || 5500;
const app = express();
const server = createServer(app);

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

server.listen(PORT, () => {
    console.log(`Server is ready ${PORT}`);
})