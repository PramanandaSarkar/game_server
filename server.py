from fastapi import FastAPI
from pydantic import BaseModel
from matchmaking_service import MatchmakingService
from models import Player, Match
from config import Config

app = FastAPI()
matchmaking_service = MatchmakingService(max_players_per_match=Config.MAX_PLAYERS_PER_MATCH, level_range=Config.LEVEL_RANGE)

class PlayerRequest(BaseModel):
    player_id: int
    level: int

@app.post("/join")
async def join_player(player_request: PlayerRequest):
    player = Player(player_id=player_request.player_id, level=player_request.level)
    match = matchmaking_service.join_player(player)
    if match:
        return {"message": "Match created", "match_id": match.match_id, "players": [p.player_id for p in match.players]}
    else:
        return {"message": "Waiting for more players to form a match."}

@app.post("/disconnect")
async def disconnect_player(player_id: int, match_id: Optional[int] = None):
    matchmaking_service.disconnect_player(player_id, match_id)
    return {"message": f"Player {player_id} disconnected."}

@app.get("/matches")
def get_matches():
    return {"matches": [{"match_id": match.match_id, "players": [p.player_id for p in match.players]} for match in matchmaking_service.matches]}

@app.get("/logs")
def get_logs():
    # Log can be fetched directly or provided through a file read in a larger app
    return {"logs": "Logs are written to a file."}
