from sqlalchemy.orm import Session
from models.match import Match
from models.player import Player
from models.server import Server

def get_player_by_id(db: Session, player_id: int):
    return db.query(Player).filter(Player.id == player_id).first()
def get_all_players(db: Session):
    return db.query(Player).all()