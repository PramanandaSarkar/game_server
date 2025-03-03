
import { playerQueue, matches, players } from "../../db/data.js";

/**
 * 
 * @param {matchId: number, playerId: number, guess: number} req 
 * @param {message: string} res 
 * @returns 
 */
const submitGuess = async (req, res) => {
    const { matchId, playerId, guess } = req.body;
    console.log(matchId, playerId, guess);

    if (!matchId || !playerId || !guess) {
        return res.status(400).json({ error: "matchId, playerId, and guess are required" });
    }

    const match = matches.find((m) => m.matchId == matchId);
    console.log(match)
    if (!match) {
        return res.status(404).json({ error: "Match not found" });
    }

    
    // Ensure `score` object exists
    if (!match.score) {
        match.score = { redTeamScore: [], blueTeamScore: [] };
    }

    const score = {
        playerId,
        guess: parseInt(guess, 10)
    };
    console.log(score)

    // Check if player already submitted a guess
    const hasSubmitted = match.score.redTeamScore.some(s => s.playerId == playerId) ||
                         match.score.blueTeamScore.some(s => s.playerId == playerId);

    if (hasSubmitted) {
        return res.status(400).json({ error: "Player has already submitted a guess" });
    }

    // Assign guess to correct team
    if (match.team.redTeam.includes(playerId)) {
        match.score.redTeamScore.push(score);
        
    } else if (match.team.blueTeam.includes(playerId)) {
        match.score.blueTeamScore.push(score);
    } else {
        return res.status(403).json({ error: "Player is not in this match" });
    }
    // set player inMatch to false
    players.find(p => p.playerId == playerId).inMatch = false; 

    return res.status(200).json({ message: "Guess submitted successfully", match });
};

/**
 * 
 * @param {matchId: number} req 
 * @param {winner: string, score: { redTeamScore: number, blueTeamScore: number }} res 
 * @returns 
 */
const getResult = async (req, res) => {
    const { matchId } = req.body;
    
    const match = matches.find((m) => m.matchId == matchId);
    console.log(match)

    if (!match) {
        return res.status(404).json({ error: "Match not found" });
    }

    // Ensure all players have submitted guesses
    if (
        match.score.redTeamScore.length !== match.team.redTeam.length ||
        match.score.blueTeamScore.length !== match.team.blueTeam.length
    ) {
        return res.status(200).json(match);
    }

    // Calculate team scores
    const redTeamScore = match.score.redTeamScore.reduce((total, score) => total + score.guess, 0);
    const blueTeamScore = match.score.blueTeamScore.reduce((total, score) => total + score.guess, 0);

    let winner;
    if (redTeamScore > blueTeamScore) {
        winner = "Red Team";
    } else if (blueTeamScore > redTeamScore) {
        winner = "Blue Team";
    } else {
        winner = "Draw";
    }

    return res.json({ winner, score: { redTeamScore, blueTeamScore } });
};

// const findMatchById = async (req, res) => {
//     const { matchId, playerId } = req.body;
//     console.log(matchId, playerId);
//     const match = matches.find((m) => m.matchId == matchId);
    
//     if (!match) {
//         return res.status(404).json({ error: "Match not found" });
//     }

//     // Check if the player is in the blue team
//     const blueTeam = match.team.blueTeam;
//     const redTeam = match.team.redTeam;

//     if (blueTeam.some(player => player == playerId)) {
//         const teamName = "blue"; // Blue team
//         return res.status(200).json({ match, teamName });
//     } else if (redTeam.some(player => player == playerId)) {
//         const teamName = "red"; // Red team
//         return res.status(200).json({ match, teamName });
//     } else {
//         return res.status(404).json({ error: "Player not found in any team" });
//     }
// };


export {
    submitGuess,
    getResult
}