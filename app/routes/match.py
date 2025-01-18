from fastapi import APIRouter
from app.services.matchmaking import MatchMaking

router = APIRouter()
matchmaking = MatchMaking()


@router.post("/match/start/{match_type}")
def start_match(match_type: int):
    match = matchmaking.create_match(match_type)
    if match:
        return {"match_id": match.id, "players": [player.id for player in match.players]}
    return {"message": "Not enough players to start match"}
