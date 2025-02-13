import express from "express";
import { getAllPlayers, getPlayerById, createPlayer } from "../controllers/auth/auth.controller.js";

const router = express.Router();

router.post("/", createPlayer);
router.get("/", getAllPlayers);
router.get("/:id", getPlayerById);

export default router;  
