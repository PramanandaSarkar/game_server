const express = require("express");
const router = express.Router();
const dbPromise = require("../db/db");



router.get("/", async (_, res) => {
    try {
        const db = await dbPromise;
        const matches = await db.all("SELECT * FROM matches");
        res.json(matches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;