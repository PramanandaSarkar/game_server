import express from "express";
const router = express.Router();


import { queuedPlayers, joinQueue, leaveQueue, runningMatches, makeMatch, getMatch } from "../controllers/match/matchCreate.controller.js";
import { submitGuess, getResult } from "../controllers/match/matchResult.controller.js";

// Get all players in the queue
router.get("/queue", queuedPlayers);
// Get all running matches
router.get("/matches", runningMatches);
// Add a player to the queue
router.post("/join-queue", joinQueue);
// Remove a player from the queue
router.post("/leave-queue", leaveQueue);
// make all possible match in queue
router.get("/make-match", makeMatch);
// find match by id
router.post("/get-match", getMatch);

// router.post("/", findMatchById)


// Submit a guess
router.post("/submit-guess", submitGuess);
// Get the result
router.post("/get-result", getResult);

export default router;
