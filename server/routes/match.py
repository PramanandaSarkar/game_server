from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from controllers.match_controller import get_all_matchs, create_match, add_player_to_match, get_active_match, start_match, calculate_match_winner, end_match, get_match_by_id
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
    


@router.websocket("/ws/{match_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, match_id: int, player_id: int, db: Session = Depends(get_db)):
    print(f"WebSocket connection attempt: match_id={match_id}, player_id={player_id}")
    # try:
    #     print(f"WebSocket connection attempt: match_id={match_id}, player_id={player_id}")

    #     await websocket.accept()
    #     match = get_match_by_id(db, match_id)
    #     if not match:
    #         print(f"Match not found: match_id={match_id}")
    #         await websocket.close(code=1008, reason="Match not found")
    #         return
    #     if match.status != "in_progress":
    #         print(f"Match not started or invalid status: match_id={match_id}, status={match.status}")
    #         await websocket.close(code=1008, reason="Match not started")
    #         return
    #     player = get_player_by_id(db, player_id)
    #     if not player:
    #         print(f"Player not found: player_id={player_id}")
    #         await websocket.close(code=1008, reason="Player not found")
    #         return
    #     if player not in match.players:
    #         print(f"Player not part of the match: match_id={match_id}, player_id={player_id}")
    #         await websocket.close(code=1008, reason="Player not in match")
    #         return

    #     # All validations passed
    #     print(f"WebSocket connection accepted: match_id={match_id}, player_id={player_id}")
    #     active_connections[player_id] = websocket
    #     while True:
    #         data = await websocket.receive_text()
    #         # Broadcast the message to other players
    #         for p in match.players:
    #             if p.id != player_id:
    #                 await active_connections[p.id].send_text(data)

    # except WebSocketDisconnect:
    #     print(f"WebSocket disconnected: player_id={player_id}")
    #     active_connections.pop(player_id, None)
    # except Exception as e:
    #     print(f"Error in WebSocket: {e}")
    #     await websocket.close(code=1008, reason="Internal server error")

