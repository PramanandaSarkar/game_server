import pytest
from models import Player
from matchmaking_service import MatchmakingService

def test_matchmaking_service():
    service = MatchmakingService()
    player1 = Player(player_id=1, level=10)
    player2 = Player(player_id=2, level=15)
    
    match = service.join_player(player1)
    assert match is None  # Should be waiting for another player
    
    match = service.join_player(player2)
    assert match is not None  # Match should be created with player1 and player2
    assert match.match_id is not None
