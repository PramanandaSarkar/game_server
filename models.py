from typing import List
from pydantic import BaseModel

class Player(BaseModel):
    player_id: int
    level: int

class Match(BaseModel):
    match_id: int
    players: List[Player]
