from sqlalchemy.orm import Session
from models.match import Match
from models.player import Player
from models.server import Server

def get_all_matchs(db: Session):
    return db.query(Match).all()

def create_match(db: Session):
    match = Match()
    db.add(match)
    db.commit()
    db.refresh(match)
    return match
def add_player_to_match(db: Session, player: Player, match: Match):
    if match.player_count >= 2:
        raise ValueError("Match is full")
    player.match_id = match.id
    match.player_count += 1
    db.commit()

def get_active_match(db: Session):
    return db.query(Match).filter(Match.status == "waiting").first()

def get_match_by_id(db: Session, match_id: int):
    return db.query(Match).filter(Match.id == match_id).first()

def start_match(db: Session, match: Match):
    match.status = "in_progress"
    db.commit()

def calculate_match_winner(db: Session, match: Match):
    players = db.query(Player).filter(Player.match_id == match.id).all()
    for player in players:
        if player.id % 2 == 0:
            player.last_match_history = "WIN"
            player.level += 1
        else:
            player.last_match_history = "LOSE"
            player.level = max(0, player.level - 1)
        db.commit()


def end_match(db: Session, match: Match):
    match.status = "finished"
    db.commit()