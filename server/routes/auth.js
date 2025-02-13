import express from "express";
import { dbPromise } from "../db.js";
const router = express.Router();


// Login route
router.post("/login", async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const db = await dbPromise;
        const user = await db.get("SELECT * FROM players WHERE id = ?", [userId]);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ userId: user.id, message: "Login successful" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Logout route (optional)
router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

export default router;
