import { players, playerQueue, matches } from "../../db/data.js"; // Use `.js` extension for ES Module support


const getQueuedPlayers = (req, res) => {
    res.json(playerQueue);
};

const runningMatches = (req, res) => {
    res.json(matches);
};

const matchMake = async () => {
   
    const matchTypes = { "2P": 2, "4P": 4, "6P": 6, "10P": 10 };

    for (const [matchType, playerCount] of Object.entries(matchTypes)) {
        const players = [...playerQueue.values()].filter(p => p.matchType == matchType);

        if (players.length >= playerCount) {
            const matchedPlayers = players.slice(0, playerCount);
            const playerIds = matchedPlayers.map(p => p.playerId);

            const redTeam = playerIds.slice(0, playerCount / 2);
            const blueTeam = playerIds.slice(playerCount / 2);

            const matchId = Date.now() + Math.floor(Math.random() * 1000);
            const Answer = Math.floor(Math.random() * 9) + 1;
            
            const score = { redTeamScore: [], blueTeamScore: [] };
            const match = { matchId, team: { redTeam, blueTeam }, Answer, score };
            matches.push(match);

            console.log(`${match.matchId} match is created`);

            for (const player of matchedPlayers) {
                playerQueue.delete(player.playerId);
            }
            // return match;
        }
    }
    return {}
};

const findMatch = (playerId) => {
    for (const match of matches) {
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
        const { playerId, matchType, isLogin, inMatch } = req.body;
        // check if playerId, matchType, isLogin, inMatch are provided
        if (!playerId || !matchType || !isLogin || !inMatch) {
            return res.status(400).json({ error: "playerId, matchType, isLogin, inMatch are required" });
        }
        // check if player is logged in
        if (!isLogin) {
            return res.status(400).json({ error: "player is not logged in" });
        }
        // check if player is already in a match
        if (inMatch) {
            return res.status(400).json({ error: "player is already in a match" });
        }
        // check if player is already in queue
        for ( const player of players) {
            if (player.playerId == playerId) {
                return res.status(400).json({ error: "playerId already in queue" });
            }
        }
        // create player object
        const player = {
            playerId : playerId,
            isLogin : isLogin,
            inMatch : inMatch,
            matchType: matchType
        };
        // add player to queue
        playerQueue.push(player); 
        console.log(`${playerId} added to the queue`);
        // response to client
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
    let teamName = "";
    if (match.team.redTeam.includes(playerId)) {
        teamName = "red";
    }
    else if (match.team.blueTeam.includes(playerId)) {
        teamName = "blue";
    }
    return res.json({ inMatch, matchId: match.matchId, teamName });

}


const leaveQueue = (req, res) => {
    try {
        const { playerId } = req.body;
        if (!playerId) {
            return res.status(400).json({ error: "playerId is required" });
        }

        if (playerQueue.has(playerId)) {
            playerQueue.delete(playerId);
            console.log(first)
            return res.json({ message: `${playerId} removed from the queue` });
        } else {
            return res.status(404).json({ error: "Player not found in queue" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export { getQueuedPlayers, runningMatches, joinGame, matchStart, leaveQueue };