const db = require("../db/db");
const express = require("express");
const router = express.Router();



router.get("/", async (_, res) => {
    res.status(200).json({ message: "Welcome to the home page" });
})

module.exports = router