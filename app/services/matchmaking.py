from app.models.match import Match
from app.models.player import Player
from typing import List, Dict


class MatchMaking:
    def __init__(self):
        self.queue: Dict[int, List[Player]] = {}
        self.matches: Dict[int, Match] = {}
        self.match_id_counter = 1

    def add_to_queue(self, player: Player, match_type: int):
        if match_type not in self.queue:
            self.queue[match_type] = []
        self.queue[match_type].append(player)

    def create_match(self, match_type: int):
        if match_type in self.queue and len(self.queue[match_type]) >= match_type:
            players = self.queue[match_type][:match_type]
            match = Match(self.match_id_counter, match_type)
            match.players = players
            match.start()

            self.matches[self.match_id_counter] = match
            self.match_id_counter += 1

            # Remove players from the queue
            self.queue[match_type] = self.queue[match_type][match_type:]
            return match
        return None
