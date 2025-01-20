import requests
import random
import time

# Server URL
SERVER_URL = "http://localhost:8000"

# Simulate random player joins
def simulate_player_join():
    player_id = random.randint(1000, 9999)
    level = random.randint(1, 100)
    player_data = {
        "player_id": player_id,
        "level": level
    }
    response = requests.post(f"{SERVER_URL}/join", json=player_data)
    print(response.json())

# Simulate random player disconnections
def simulate_player_disconnect():
    player_id = random.randint(1000, 9999)
    match_id = random.choice([None, random.randint(1000, 9999)])
    response = requests.post(f"{SERVER_URL}/disconnect", json={"player_id": player_id, "match_id": match_id})
    print(response.json())

# Simulate sending requests
while True:
    action = random.choice(["join", "disconnect"])

    if action == "join":
        simulate_player_join()
    else:
        simulate_player_disconnect()

    # Random delay between actions
    time.sleep(random.uniform(0.5, 2.0))
