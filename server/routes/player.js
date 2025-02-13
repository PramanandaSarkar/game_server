const express = require("express");
const router = express.Router();
const { getAllPlayers, getPlayerById, createPlayer } = require("../controllers/auth/auth.controller");


router.post("/", createPlayer);
router.get("/", getAllPlayers);
router.get("/:id", getPlayerById);


module.exports = router;
