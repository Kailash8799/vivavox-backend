require('dotenv').config()
import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI

const connectDb = () => {
    try {
        mongoose.set("strictQuery", true);
        mongoose.connect(MONGO_URI).then(() => {
            console.log("Connected succesfully")
        }).catch((error) => {
            console.log(error);
            console.log("Some error occured in mongodb connection ")
        })
    } catch (error) {

    }
}

export default connectDb;