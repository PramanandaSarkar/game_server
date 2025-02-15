import express from "express";
import dbPromise  from "../db/db.js";
const router = express.Router();
import { players } from "../db/data.js";

// Login route
router.post("/login", async (req, res) => {
    const { playerId } = req.body;

    if (!playerId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // const db = await dbPromise;
        // const user = await db.get("SELECT * FROM players WHERE id = ?", [userId]);

        // if (!user) {
        //     return res.status(404).json({ error: "User not found" });
        // }
        if (!players[playerId]) {
            return res.status(404).json({ error: "player not found" });
        }

        let player = players[playerId];
        player.isLogin = true;


        res.status(200).json({ playerId: player.playerId, message: "Login successful", player  });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Logout route (optional)
router.post("/logout", (req, res) => {
    const { playerId } = req.body;
    players[playerId].isLogin = false;
    const player = players[playerId];
    res.status(200).json({ message: "Logout successful", player });
});

export default router;
