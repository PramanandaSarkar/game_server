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
            // Create a match with the required number of players
            const matchedPlayers = players.slice(0, playerCount);
            const playerIds = matchedPlayers.map(p => p.playerId);

            // create two team from the players and assign them red or blue team  after that guess a number (1-9) randomly for this match
            // half player will be in red team and half player will be in blue team
            const redTeam = playerIds.slice(0, playerCount / 2);
            const blueTeam = playerIds.slice(playerCount / 2);
            const team = { redTeam, blueTeam };
            const Answer = Math.floor(Math.random() * 9) + 1;
            const matchId = Math.floor(Math.random() * 1000000);
            // save matches in a list for later use
            matches.push({ matchId, team, Answer });


            // // Store match in the database
            // const result = await db.run(
            //     `INSERT INTO matches (matchType, players) VALUES (?, ?)`,
            //     [matchType, JSON.stringify(playerIds)]
            // );

            console.log(`Match created: ${matchType}, Players: ${playerIds}`);

            // Remove matched players from the queue
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

})

module.exports = router;
