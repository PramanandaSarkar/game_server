from datetime import datetime
from typing import List


class Player:
    def __init__(self, player_id: int, server_id: int, rank: int):
        self.id = player_id
        self.serverId = server_id
        self.rank = rank
        self.connectionLog: List[str] = []
        self.matchLog: List[str] = []
        self.matchResult: List[str] = []
        self.inMatch = False

    def connect(self):
        log_entry = f"LOGIN\t{datetime.now()}\n"
        self.connectionLog.append(log_entry)

    def disconnect(self):
        log_entry = f"LOGOUT\t{datetime.now()}\n"
        self.connectionLog.append(log_entry)

    def join_match(self, match_id: int):
        self.inMatch = True
        log_entry = f"JOIN_MATCH\t{match_id}\t{datetime.now()}\n"
        self.matchLog.append(log_entry)

    def end_match(self, match_id: int, win: bool):
        self.inMatch = False
        self.rank += 1 if win else 0
        result = "WIN" if win else "LOSS"
        log_entry = f"END_MATCH\t{match_id}\t{result}\t{datetime.now()}\n"
        self.matchLog.append(log_entry)
