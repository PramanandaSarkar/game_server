from sqlalchemy.orm import Session
from models.player import Player

def get_all_players(db: Session):
    return db.query(Player).all()

def create_player(db: Session, name: str, server_id: int):
    new_player = Player(name=name, server_id=server_id, level=0, match_history="")
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player
