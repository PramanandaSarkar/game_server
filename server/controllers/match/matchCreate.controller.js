import data from "../../db/data.js"; // Use `.js` extension for ES Module support


const getQueuedPlayers = (req, res) => {
    res.json([...data.playerQueue.values()]);
};

const runningMatches = (req, res) => {
    res.json(data.matches);
};

const matchMake = async () => {
   
    const matchTypes = { "2P": 2, "4P": 4, "6P": 6, "10P": 10 };

    for (const [matchType, playerCount] of Object.entries(matchTypes)) {
        const players = [...data.playerQueue.values()].filter(p => p.matchType === matchType);

        if (players.length >= playerCount) {
            const matchedPlayers = players.slice(0, playerCount);
            const playerIds = matchedPlayers.map(p => p.playerId);

            const redTeam = playerIds.slice(0, playerCount / 2);
            const blueTeam = playerIds.slice(playerCount / 2);

            const matchId = Date.now() + Math.floor(Math.random() * 1000);
            const Answer = Math.floor(Math.random() * 9) + 1;
            
            const score = { redTeamScore: [], blueTeamScore: [] };
            const match = { matchId, team: { redTeam, blueTeam }, Answer, score };
            data.matches.push(match);

            console.log(`${match.matchId} match is created`);

            for (const player of matchedPlayers) {
                data.playerQueue.delete(player.playerId);
            }
            // return match;
        }
    }
    return {}
};

const findMatch = (playerId) => {
    for (const match of data.matches) {
        for (const player of match.team.redTeam) {
            if (player == playerId) {
                return match;
            }
        }
        for (const player of match.team.blueTeam) {
            if (player == playerId) {
                return match;
            }
        }
    }
    return null;
}

const joinGame = async (req, res) => {
    try {
        const { playerId, matchType } = req.body;
        if (!playerId || !matchType) {
            return res.status(400).json({ error: "playerId and matchType are required" });
        }

        if (data.playerQueue.has(playerId)) {
            return res.status(400).json({ error: "Player already in the queue" });
        }

        // Add player to queue
        data.playerQueue.set(playerId, { playerId, matchType });

        // Check for matchmaking
        // await matchMake();

        res.json({ message: `${playerId} added to the queue` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


const matchStart = async (req, res) => {
    await matchMake();
    let { playerId } = req.body;
    let inMatch = false;  
    let match = findMatch(playerId);
    if (!match) {
        return res.json({ inMatch });
    }
    inMatch = true;
    return res.json({ inMatch, matchId: match.matchId });

}


const leaveQueue = (req, res) => {
    try {
        const { playerId } = req.body;
        if (!playerId) {
            return res.status(400).json({ error: "playerId is required" });
        }

        if (data.playerQueue.has(playerId)) {
            data.playerQueue.delete(playerId);
            return res.json({ message: `${playerId} removed from the queue` });
        } else {
            return res.status(404).json({ error: "Player not found in queue" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export { getQueuedPlayers, runningMatches, joinGame, matchStart, leaveQueue };