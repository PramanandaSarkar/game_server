from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from controllers.auth_controller import get_all_players, create_player
from pydantic import BaseModel

router = APIRouter(
    prefix="/players",
    tags=["players"]
)

class PlayerRequest(BaseModel):
    server_id: int
    name: str
    
    

@router.get("/")
def read_players(db: Session = Depends(get_db)):
    players = get_all_players(db)
    return players

@router.post("/")
def add_player(player: PlayerRequest, db: Session = Depends(get_db)):
    new_player = create_player(db, player.name, player.server_id, )
    return new_player
