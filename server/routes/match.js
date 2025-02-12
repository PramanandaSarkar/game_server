const express = require("express");
const router = express.Router();
const dbPromise = require("../db/db");

// Store players in a queue using a Map (playerId as key)
const playerQueue = new Map();
const matches = [];

// Matchmaking function
const matchMake = async () => {
    const db = await dbPromise;
    const matchTypes = { "2P": 2, "4P": 4, "6P": 6, "10P": 10 };

    for (const [matchType, playerCount] of Object.entries(matchTypes)) {
        const players = [...playerQueue.values()].filter(p => p.matchType === matchType);

        if (players.length >= playerCount) {
            const matchedPlayers = players.slice(0, playerCount);
            const playerIds = matchedPlayers.map(p => p.playerId);

            const redTeam = playerIds.slice(0, playerCount / 2);
            const blueTeam = playerIds.slice(playerCount / 2);

            const matchId = Date.now() + Math.floor(Math.random() * 1000);
            const Answer = Math.floor(Math.random() * 9) + 1;
            
            const score = { redTeamScore: [], blueTeamScore: [] };

            matches.push({ matchId, team: { redTeam, blueTeam }, Answer, score });

            console.log(`Match created: ${matchType}, Players: ${playerIds}`);

            for (const player of matchedPlayers) {
                playerQueue.delete(player.playerId);
            }
        }
    }
};

// Get all matches from the database
router.get("/", async (_, res) => {
    try {
        const db = await dbPromise;
        const matches = await db.all("SELECT * FROM matches");
        res.json(matches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all players in the queue
router.get("/queue", (_, res) => {
    res.json([...playerQueue.values()]);
});

router.get("/matches", (_, res) => {
    res.json(matches);
});


// Add a player to the queue
router.post("/join", async (req, res) => {
    try {
        const { playerId, matchType } = req.body;
        if (!playerId || !matchType) {
            return res.status(400).json({ error: "playerId and matchType are required" });
        }

        if (playerQueue.has(playerId)) {
            return res.status(400).json({ error: "Player already in the queue" });
        }

        // Add player to queue
        playerQueue.set(playerId, { playerId, matchType });

        // Check for matchmaking
        await matchMake();

        res.json({ message: `${playerId} added to the queue` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove a player from the queue
router.post("/leave", (req, res) => {
    try {
        const { playerId } = req.body;
        if (!playerId) {
            return res.status(400).json({ error: "playerId is required" });
        }

        if (playerQueue.has(playerId)) {
            playerQueue.delete(playerId);
            return res.json({ message: `${playerId} removed from the queue` });
        } else {
            return res.status(404).json({ error: "Player not found in queue" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/match-start", (req, res) => {
    const { playerId } = req.body;
    const inMatch = false;
    for (const match of matches) {
        if (match.redTeam.includes(playerId) || match.blueTeam.includes(playerId)) {
            inMatch = true;
            return res.json({inMatch, match});
        }
    }
    return res.json({ inMatch }); 
})

router.post("/submit-guess", (req, res) => {
    const { matchId, playerId, guess } = req.body;

    const match = matches.find((m) => m.matchId === matchId);
    if (!match) {
        return res.status(404).json({ error: "Match not found" });
    }

    // Ensure `team` object exists
    if (!match.team || !match.team.redTeam || !match.team.blueTeam) {
        return res.status(500).json({ error: "Match teams not properly set" });
    }

    const score = {
        playerId: playerId,
        guess: parseInt(guess)
    };

    if (match.team.redTeam.includes(playerId)) {
        match.score.redTeamScore.push(score);
    } else if (match.team.blueTeam.includes(playerId)) {
        match.score.blueTeamScore.push(score);
    } else {
        return res.status(400).json({ error: "Player is not in this match" });
    }

    return res.json({ message: "Guess submitted successfully", match });
});

router.post("/get-result", (req, res) => {
    const { matchId } = req.body;
    const match = matches.find((m) => m.matchId === matchId);
    if (!match) {
        return res.status(404).json({ error: "Match not found" });
    }

    if (match.score.redTeamScore.length != match.team.redTeam.length || match.score.blueTeamScore.length != match.team.blueTeam.length) {
        return res.status(400).json({ error: "All players have not submitted their guesses" });
    }
    
    const redTeamScore = match.score.redTeamScore.reduce((total, score) => total + score.guess, 0);
    const blueTeamScore = match.score.blueTeamScore.reduce((total, score) => total + score.guess, 0);

    if (redTeamScore > blueTeamScore) {
        return res.json({ winner: "Red Team", score: {redTeamScore, blueTeamScore} });
    } else if (blueTeamScore > redTeamScore) {
        return res.json({ winner: "Blue Team", score: {redTeamScore, blueTeamScore} });
    } else {
        return res.json({ winner: "Draw", score: {redTeamScore, blueTeamScore} });
    }
});


module.exports = router;
