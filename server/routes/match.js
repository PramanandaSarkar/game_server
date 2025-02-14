import express from "express";
const router = express.Router();


import { getQueuedPlayers, runningMatches, joinGame, leaveQueue, matchStart } from "../controllers/match/matchCreate.controller.js";
import { submitGuess, getResult, findMatchById } from "../controllers/match/matchResult.controller.js";

// Get all players in the queue
router.get("/queue", getQueuedPlayers);
// Get all running matches
router.get("/matches", runningMatches);
// Add a player to the queue
router.post("/join", joinGame);
// Remove a player from the queue
router.post("/leave", leaveQueue);
// Check if player is in a match
router.post("/match-start", matchStart);

router.post("/", findMatchById)


// Submit a guess
router.post("/submit-guess", submitGuess);
// Get the result
router.post("/get-result", getResult);

export default router;
