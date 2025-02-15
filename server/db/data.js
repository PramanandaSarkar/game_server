let playerQueue;
let matches;
let players;
let player1, player2, player3, player4, player5;
let match1;
player1 = {
    playerId: 10001,
    isLogin: true,
    inMatch: true,
    matchType: "2P"
}

player2 = {
    playerId: 10002,
    isLogin: true,
    inMatch: true,
    matchType: "2P"
}

player3 = {
    playerId: 10003,
    isLogin: true,
    inMatch: false,
    matchType: "2P"
}
player4 = {
    playerId: 10004,
    isLogin: true,
    inMatch: false,
    matchType: "4P"
}

player5 = {
    playerId: 10005,
    isLogin: true,
    inMatch: false,
    matchType: "2P"
}


match1 = {
    matchId: 1000001,
    team: {
        redTeam: [player1.playerId],
        blueTeam: [player2.playerId]
    },
    Answer: 5,
    score: {
        redTeamScore: [],
        blueTeamScore: []
    }
}

players = [player1, player2, player3, player4, player5];
playerQueue = [player3, player4, player5];
matches = [match1];




export {players, playerQueue, matches };
