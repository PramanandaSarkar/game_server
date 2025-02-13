
import data from "../../db/data.js";


const submitGuess = async (req, res) => {
    const { matchId, playerId, guess } = req.body;

    const match = data.matches.find((m) => m.matchId === matchId);
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
}


const getResult = async (req, res) => {
    const { matchId } = req.body;
    const match = data.matches.find((m) => m.matchId === matchId);
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
}


module.exports = {
    submitGuess,
    getResult
}