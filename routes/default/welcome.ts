import express from 'express'
const router = express.Router();

router.get("/",(req, res) => {
    res.json({message: "Welcome to Vivavox API" });
    return;
})
router.get("/verifyemail",(req, res) => {
    res.json({message: "Verify email" });
    return;
})

export default router