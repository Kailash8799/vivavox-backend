require('dotenv').config();
import mongoose from "mongoose";

const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;

const ProfileSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
        },
        isSuperlike: {
            type: Boolean,
            default: false,
        }
    }],
    remotelikes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
        },
        isSuperlike: {
            type: Boolean,
            default: false,
        }
    }],
    allswipe: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    }],
    profileimage: { type: String, default: DEFAULT_IMAGE },
    images: { type: Array, default: [] },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String },
    location: { type: String },
    birthdate: { type: Date, default: null },
    language: { type: Array, default: [] },
    aboutme: { type: String, },
    collageName: { type: String, },
    companyName: { type: String, },
    instagranId: { type: String },
    height: { type: String, },
    interest: { type: String, },
    jobTitle: { type: String },
    liviningIn: { type: String },
    mobileno: { type: String, },
    relationshipGoal: { type: String, },
    relationshipType: { type: String, },
    sexualOrientation: { type: String, },
    askMeAbout: {
        goingOut: { type: String },
        myWeekends: { type: String },
        meandmyphone: { type: String },
    },
    basics: {
        zodiac: { type: String },
        eduction: { type: String },
        familyPlan: { type: String },
        communication: { type: String },
        covidVaccine: { type: String },
        personalityType: { type: String },
        loveStyle: { type: String },
    },
    lifeStyle: {
        pets: { type: String },
        dietaryPreference: { type: String },
        drinking: { type: String },
        sleepingHabits: { type: String },
        smoking: { type: String },
        socialMedia: { type: String },
        workout: { type: String },
    },
    premiumuser: { type: Boolean, default: false },
    premiumtype: { type: String, default: "NONE", enum: ["NONE", "BASIC", "PRO"] },
    premiumenddate: { type: Date },
    premiumstartdate: { type: Date },
}, { timestamps: true })

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);