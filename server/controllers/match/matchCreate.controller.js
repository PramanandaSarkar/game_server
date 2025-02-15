import { players, playerQueue, matches, matchTypes } from "../../db/data.js"; // Use `.js` extension for ES Module support


const queuedPlayers = (req, res) => {
    res.json(playerQueue);
};

const runningMatches = (req, res) => {
    res.json(matches);
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

const joinQueue = async (req, res) => {
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


/**
 * 
 * @param {*} res 
 * @returns 
 */
const makeMatch = async (_, res) => {
    //  find matchType and playerCount 
    for(const [matchType, playerCount] of Object.entries(matchTypes)) {
        const players = [...playerQueue.values()].filter(p => p.matchType == matchType);
        if (players.length >= playerCount) {
            const matchedPlayers = players.slice(0, playerCount);
            const playerIds = matchedPlayers.map(p => p.playerId);

            const redTeam = playerIds.slice(0, playerCount / 2);
            const blueTeam = playerIds.slice(playerCount / 2);

            const matchId = Date.now() + Math.floor(Math.random() * 1000);
            const answer = Math.floor(Math.random() * 9) + 1;
            
            const score = { redTeamScore: [], blueTeamScore: [] };
            const team = { redTeam, blueTeam };
            const match = { matchId, team, answer, score };
            matches.push(match);

            console.log(`${match.matchId} match is created`);

            // delete player from queue and set there inMatch to true
            for (const player of matchedPlayers) {
                const index = playerQueue.findIndex(p => p.playerId == player.playerId);
                if (index !== -1) {
                    playerQueue.splice(index, 1);
                }
                player.inMatch = true;
            }
                        
        }
        
    }
    // temporarily return matches
    return res.json({ message: "Match created successfully", matches });   

}


/**
 * 
 * @param {playerId: number} req 
 * @param {matchId: number, teamName: string} res 
 * @returns 
 */
const getMatch = (req, res) => {
    try {
        const { playerId } = req.body;
        if (!playerId) {
            return res.status(400).json({ error: "playerId is required" });
        }
        // check if player is logged in and in a match
        for (const player of players) {
            if (player.playerId == playerId) {
                if (!player.isLogin || !player.inMatch) {
                    return res.status(404).json({ error: "first login and join a match" });
                }
            }
        }

        // find player match and team and return
        for (const match of matches) {
            for (const player of match.team.redTeam) {
                if (player == playerId) {
                    return res.json({matchId: match.matchId, teamName: "red"});
                }
            }
            for (const player of match.team.blueTeam) {
                if (player == playerId) {
                    return res.json({matchId: match.matchId, teamName: "blue"});
                }
            }
            
        }
        // something went wrong
        return res.status(404).json({ error: "playerId not found in any match" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


/**
 * 
 * @param {playerId: number} req 
 * @param {message: string} res 
 * @returns 
 */
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


export { joinQueue, makeMatch, getMatch, leaveQueue, queuedPlayers, runningMatches };