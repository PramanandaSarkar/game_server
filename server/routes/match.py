from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from controllers.match_controller import get_all_matchs, create_match, add_player_to_match, get_active_match, start_match, calculate_match_winner, end_match
from controllers.player_controller import get_player_by_id

router = APIRouter(
    prefix="/matchs",
    tags=["matchs"]
)

active_connections = {}

@router.get("/")
def read_matchs(db: Session = Depends(get_db)):
    matchs = get_all_matchs(db)
    return matchs

@router.post("/join")
def join_match(player_id: int, db: Session = Depends(get_db)):
    match = get_active_match(db)
    if not match:
        match = create_match(db)
    player = get_player_by_id(db, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    add_player_to_match(db, player, match)
    if match.player_count == 2:
        start_match(db, match)
    return {
        "match_id": match.id,
        "status": match.status,
        "reacent_join": player.name,
        "player_count": match.player_count,
        "players": [player.name for player in match.players],
        
    }
    
