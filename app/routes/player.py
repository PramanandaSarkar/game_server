from fastapi import APIRouter
from app.services.matchmaking import MatchMaking
from app.models.player import Player

router = APIRouter()
matchmaking = MatchMaking()


@router.post("/player/{player_id}/join/{match_type}")
def join_queue(player_id: int, match_type: int):
    player = Player(player_id, server_id=1, rank=1)
    matchmaking.add_to_queue(player, match_type)
    return {"message": f"Player {player_id} added to queue for match type {match_type}"}
