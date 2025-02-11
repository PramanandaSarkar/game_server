const express = require("express");
const router = express.Router();
const dbPromise = require("../db/db");

router.post("/", async (req, res) => {
    const { id, name, rank, server_id } = req.body;
    try {
        const db = await dbPromise; // Await db instance
        await db.run("INSERT INTO players (id, name, rank, server_id) VALUES (?, ?, ?, ?)", [id, name, rank, server_id]);
        res.json({ message: "Player added successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", async (_, res) => {
    try {
        const db = await dbPromise; // Await db instance
        const players = await db.all("SELECT * FROM players"); // Fixed table name
        res.json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const db = await dbPromise; // Await db instance
        const player = await db.get("SELECT * FROM players WHERE id = ?", [req.params.id]);

        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }

        res.json(player);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
