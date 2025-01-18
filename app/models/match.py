from datetime import datetime
from typing import List
from app.models.player import Player


class Match:
    def __init__(self, match_id: int, match_type: int):
        self.id = match_id
        self.matchType = match_type
        self.players: List[Player] = []
        self.startTime = None
        self.endTime = None
        self.isActive = False

    def start(self):
        self.startTime = datetime.now()
        self.isActive = True

    def end(self):
        self.endTime = datetime.now()
        self.isActive = False
