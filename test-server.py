from fastapi import FastAPI
from pydantic import BaseModel
import asyncio
from typing import List
from random import randint
import logging

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger()

# Player and Match data models
class Player(BaseModel):
    player_id: int
    level: int

class Match(BaseModel):
    match_id: int
    players: List[Player]

# Queue to manage players waiting for a match
waiting_queue = []
matches = []

# Log data
log_data = {
    "total_players": 0,
    "total_matches": 0,
    "players_joined": 0,
    "matches_created": 0,
    "players_disconnected": 0,
}

# Matchmaking logic with logging
async def matchmake_player(player: Player):
    global waiting_queue, log_data

    # Try to form a fair match
    matched_players = [player]
    for waiting_player in waiting_queue:
        if abs(waiting_player.level - player.level) <= 10:  # Fair level range
            matched_players.append(waiting_player)
            waiting_queue.remove(waiting_player)
        if len(matched_players) >= 4:  # Max players in a match
            break

    # Create a match if there are enough players
    if len(matched_players) >= 2:
        match_id = randint(1000, 9999)  # Random match ID
        match = Match(match_id=match_id, players=matched_players)
        matches.append(match)
        log_data["matches_created"] += 1
        logger.info(f"Match created: {match.match_id} with {len(matched_players)} players.")
        return match
    else:
        # If not enough players, return player to queue
        waiting_queue.append(player)
        return None

# Endpoint to join player and trigger matchmaking
@app.post("/join")
async def join_player(player: Player):
    global log_data

    # Log player join event
    log_data["players_joined"] += 1
    log_data["total_players"] += 1
    logger.info(f"Player {player.player_id} with level {player.level} joined the queue.")

    # Start matchmaking for the player
    match = await matchmake_player(player)

    if match:
        return {"message": "Match created", "match_id": match.match_id, "players": [p.player_id for p in match.players]}
    else:
        return {"message": "Waiting for more players to form a match."}

# Endpoint for player disconnection
@app.post("/disconnect")
async def disconnect_player(player_id: int, match_id: int = None):
    global log_data

    # Log player disconnection event
    log_data["players_disconnected"] += 1
    logger.info(f"Player {player_id} disconnected.")

    # If player is in a match, we keep the match ongoing
    if match_id:
        return {"message": f"Player {player_id} disconnected from match {match_id}, but match continues."}
    else:
        return {"message": f"Player {player_id} disconnected before match started."}

# Endpoint to view current matches
@app.get("/matches")
def get_matches():
    return {"matches": [{"match_id": match.match_id, "players": [p.player_id for p in match.players]} for match in matches]}

# Endpoint to get log statistics
@app.get("/logs")
def get_logs():
    return log_data
