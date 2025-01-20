from enum import Enum
from typing import List, Dict, Optional
from datetime import datetime
from fastapi import FastAPI



# Global Configurations
class GlobalConfig:
    timeScaling: int = 1  # Placeholder for time scaling factor


class ServerConfig:
    MATCH_LOG = "logs/match.log"
    PLAYER_CONNECTION_LOG = "logs/player.log"
    MATCH_DETAILS_LOG = "logs/match_details.log"


class MatchConfig:
    CONSIDER_MATCH_RESULT = 10  # Max number of match results to consider for rank adjustments


class Match_Type(Enum):
    TWO_PLAYER = 2
    FOUR_PLAYER = 4
    SIX_PLAYER = 6
    EIGHT_PLAYER = 8
    TEN_PLAYER = 10


# Match Class
class Match:
    def __init__(self, id: int, matchType: Match_Type):
        self.id = id
        self.matchType = matchType
        self.players: List[Player] = []
        self.startTime: Optional[str] = None
        self.endTime: Optional[str] = None
        self.isActive: bool = False

    def start(self):
        self.startTime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.isActive = True

    def end(self):
        self.endTime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.isActive = False


# Player Class
class Player:
    def __init__(self, player_id: int, server_id: int, rank: int):
        self.id = player_id
        self.serverId = server_id
        self.rank = rank
        self.connectionLog: List[str] = []
        self.matchLog: List[str] = []
        self.matchResult: List[str] = []
        self.inMatch: bool = False

    @staticmethod
    def formatLog(action: str, time: str) -> str:
        return f"{action}\t{time}\n"

    def joinMatch(self, time: str):
        self.inMatch = True
        log_str = self.formatLog("JOIN_MATCH", time)
        self.matchLog.append(log_str)

    def disconnect(self, time: str):
        if self.inMatch:
            log_str = self.formatLog("DISCONNECTED", time)
            self.matchLog.append(log_str)
        log_str = self.formatLog("LOGOUT", time)
        self.connectionLog.append(log_str)
        self.inMatch = False

    def connect(self, time: str):
        log_str = self.formatLog("LOGIN", time)
        self.connectionLog.append(log_str)

    def endMatch(self, time: str, isWin: bool):
        if isWin:
            self.rank += 1
        self.matchResult.append("1" if isWin else "0")
        if len(self.matchResult) > MatchConfig.CONSIDER_MATCH_RESULT:
            self.matchResult = self.matchResult[:MatchConfig.CONSIDER_MATCH_RESULT]
        log_str = self.formatLog("END_MATCH", time)
        self.matchLog.append(log_str)


# Matchmaking Class
class MatchMaking:
    def __init__(self):
        self.players_queue: Dict[Match_Type, List[Player]] = {match_type: [] for match_type in Match_Type}
        self.active_matches: Dict[int, Match] = {}
        self.match_id_counter = 1

    def add_player_to_queue(self, player: Player, match_type: Match_Type):
        """Add a player to the matchmaking queue for a specific match type."""
        self.players_queue[match_type].append(player)

    def create_match(self, match_type: Match_Type):
        """Create a match if enough players are available in the queue."""
        queue = self.players_queue[match_type]
        if len(queue) >= match_type.value:
            players_for_match = queue[:match_type.value]
            match = Match(self.match_id_counter, match_type)
            match.players = players_for_match
            match.start()
            self.active_matches[self.match_id_counter] = match
            self.match_id_counter += 1

            # Remove players from the queue
            self.players_queue[match_type] = queue[match_type.value:]

            # Log players joining the match
            for player in players_for_match:
                player.joinMatch(match.startTime)

            return match
        return None

    def match_players(self):
        """Try to create matches for all match types."""
        for match_type in Match_Type:
            while len(self.players_queue[match_type]) >= match_type.value:
                self.create_match(match_type)


# Logger Class
class Logger:
    @staticmethod
    def log_match(match: Match):
        """Log match details."""
        with open(ServerConfig.MATCH_LOG, 'a') as log_file:
            log_file.write(
                f"Match ID {match.id} - Type: {match.matchType.name} - Players: {[player.id for player in match.players]} - Start: {match.startTime} - End: {match.endTime}\n"
            )

    @staticmethod
    def log_player(player: Player):
        """Log player connection and disconnection."""
        with open(ServerConfig.PLAYER_CONNECTION_LOG, 'a') as log_file:
            log_file.write(f"Player {player.id} - Server {player.serverId} - Rank: {player.rank}\n")


# Server Class
class Server:
    def __init__(self, server_id: int):
        self.server_id = server_id
        self.players: List[Player] = []
        self.matchmaking = MatchMaking()

    def add_player(self, player: Player):
        """Add a player to the server."""
        self.players.append(player)
        player.connect(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        Logger.log_player(player)

    def start_matchmaking(self):
        """Start the matchmaking process."""
        self.matchmaking.match_players()


# Simulation of the Game Server
def simulate_game_server():
    # Create servers
    server_1 = Server(server_id=1)
    server_2 = Server(server_id=2)

    # Create players and assign them to servers
    players = [Player(player_id=i, server_id=(1 if i % 2 == 0 else 2), rank=i % 5 + 1) for i in range(1, 21)]

    # Add players to servers
    for player in players:
        if player.serverId == 1:
            server_1.add_player(player)
        else:
            server_2.add_player(player)

    # Start matchmaking on both servers
    server_1.start_matchmaking()
    server_2.start_matchmaking()

app = FastAPI()
@app.get('/')
def home():
    return "home page"


if __name__ == "__main__":
    simulate_game_server()
