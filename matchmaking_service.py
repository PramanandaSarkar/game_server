from random import randint
from models import Player, Match
from typing import List, Optional
from logger import Logger

class MatchmakingService:
    def __init__(self, max_players_per_match: int = 4, level_range: int = 10):
        self.waiting_queue: List[Player] = []
        self.matches: List[Match] = []
        self.max_players_per_match = max_players_per_match
        self.level_range = level_range
        self.logger = Logger()

    def join_player(self, player: Player) -> Optional[Match]:
        self.logger.log(f"Player {player.player_id} joined with level {player.level}")
        match = self.matchmake_player(player)
        if match:
            return match
        return None

    def matchmake_player(self, player: Player) -> Optional[Match]:
        matched_players = [player]
        for waiting_player in self.waiting_queue:
            if abs(waiting_player.level - player.level) <= self.level_range:
                matched_players.append(waiting_player)
                self.waiting_queue.remove(waiting_player)
            if len(matched_players) >= self.max_players_per_match:
                break

        if len(matched_players) >= 2:
            match_id = randint(1000, 9999)
            match = Match(match_id=match_id, players=matched_players)
            self.matches.append(match)
            self.logger.log(f"Match created: {match.match_id} with {len(matched_players)} players.")
            return match
        else:
            self.waiting_queue.append(player)
            self.logger.log(f"Player {player.player_id} added to waiting queue.")
            return None

    def disconnect_player(self, player_id: int, match_id: Optional[int] = None) -> None:
        if match_id:
            self.logger.log(f"Player {player_id} disconnected from match {match_id}, but match continues.")
        else:
            self.logger.log(f"Player {player_id} disconnected before match started.")
