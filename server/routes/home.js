import express from "express";
const router = express.Router();



router.get("/", async (_, res) => {
    res.status(200).json({ message: "Welcome to the home page" });
})

export default router;