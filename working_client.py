import random
import time
import requests

# Server URL
SERVER_URL = "http://127.0.0.1:8000"

# Configuration
PLAYER_COUNT = 10
MATCH_TYPES = [2, 4, 6, 8, 10]

# Simulated player actions
def connect_player(player_id):
    url = f"{SERVER_URL}/player/connect"
    response = requests.post(url, json={"player_id": player_id})
    print(f"[CONNECT] Player {player_id}: {response.json()}")

def join_queue(player_id):
    match_type = random.choice(MATCH_TYPES)
    url = f"{SERVER_URL}/player/{player_id}/join/{match_type}"
    response = requests.post(url)
    print(f"[QUEUE] Player {player_id} joined queue for match type {match_type}: {response.json()}")

def disconnect_player(player_id):
    url = f"{SERVER_URL}/player/disconnect"
    response = requests.post(url, json={"player_id": player_id})
    print(f"[DISCONNECT] Player {player_id}: {response.json()}")

def start_match(match_type):
    url = f"{SERVER_URL}/match/start/{match_type}"
    response = requests.post(url)
    print(f"[MATCH START] Match type {match_type}: {response.json()}")

# Client loop
def simulate_players():
    players = list(range(1, PLAYER_COUNT + 1))

    while True:
        action = random.choice(["connect", "queue", "disconnect", "start_match"])
        player_id = random.choice(players)

        try:
            if action == "connect":
                connect_player(player_id)
            elif action == "queue":
                join_queue(player_id)
            elif action == "disconnect":
                disconnect_player(player_id)
            elif action == "start_match":
                match_type = random.choice(MATCH_TYPES)
                start_match(match_type)
        except Exception as e:
            print(f"Error during {action} for Player {player_id}: {e}")

        # Simulate random delay between actions
        time.sleep(random.uniform(0.5, 2))

if __name__ == "__main__":
    simulate_players()
