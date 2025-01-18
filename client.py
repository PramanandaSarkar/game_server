import requests
import random
import time
from app_config import Config

class MatchmakingClient:
    def __init__(self, server_url: str = "http://localhost:8000"):
        self.server_url = server_url

    def simulate_player_join(self):
        player_id = random.randint(1000, 9999)
        level = random.randint(1, 100)
        player_data = {
            "player_id": player_id,
            "level": level
        }
        response = requests.post(f"{self.server_url}/join", json=player_data)
        print(response.json())

    def simulate_player_disconnect(self):
        player_id = random.randint(1000, 9999)
        match_id = random.choice([None, random.randint(1000, 9999)])
        response = requests.post(f"{self.server_url}/disconnect", json={"player_id": player_id, "match_id": match_id})
        print(response.json())

    def start_simulation(self):
        while True:
            action = random.choice(["join", "disconnect"])

            if action == "join":
                self.simulate_player_join()
            else:
                self.simulate_player_disconnect()

            time.sleep(random.uniform(0.5, 2.0))

# Run the simulation
if __name__ == "__main__":
    client = MatchmakingClient()
    client.start_simulation()
