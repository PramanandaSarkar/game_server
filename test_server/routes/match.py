from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from controllers.match_controller import get_all_matchs, create_match, add_player_to_match, get_active_match, start_match, calculate_match_winner, end_match, get_match_by_id
from controllers.player_controller import get_player_by_id, get_all_players
from controllers.chat_controller import save_chat_message
from fastapi.responses import HTMLResponse


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
    


# @router.websocket("/ws/{match_id}/{player_id}")
# async def websocket_endpoint(websocket: WebSocket, match_id: int, player_id: int, db: Session = Depends(get_db)):
#     print(f"WebSocket connection attempt: match_id={match_id}, player_id={player_id}")
#     try:
#         await websocket.accept()
#         match = get_match_by_id(db, match_id)
#         player = get_player_by_id(db, player_id)

#         if not match or not player or player not in match.players or match.status != "in_progress":
#             await websocket.close(code=1008, reason="Invalid match or player")
#             return

#         # Store the WebSocket connection
#         active_connections[player_id] = websocket

#         while True:
#             data = await websocket.receive_text()
#             # Save the message in the database
#             save_chat_message(db, match_id=match_id, player_id=player_id, message=data)

#             # Broadcast the message to other players
#             for p in match.players:
#                 if p.id != player_id:
#                     await active_connections[p.id].send_text(f"{player.name}: {data}")

#     except WebSocketDisconnect:
#         active_connections.pop(player_id, None)
#     except Exception as e:
#         await websocket.close(code=1008, reason="Internal server error")

html = """
<!DOCTYPE html>
<html>
<head>
    <title>Match Chat</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
        }
        h1 {
            text-align: center;
        }
        #chat-container {
            max-width: 600px;
            margin: 0 auto;
        }
        #messages {
            list-style-type: none;
            padding: 0;
            border: 1px solid #ccc;
            height: 300px;
            overflow-y: auto;
            margin-bottom: 10px;
        }
        #messages li {
            padding: 5px;
            border-bottom: 1px solid #ddd;
        }
        #messages li:last-child {
            border-bottom: none;
        }
        #message-form {
            display: flex;
        }
        #messageText {
            flex: 1;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-right: none;
            outline: none;
        }
        #sendButton {
            padding: 10px 20px;
            font-size: 16px;
            border: 1px solid #ccc;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            outline: none;
        }
        #sendButton:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h1>Match Chat</h1>
    <div id="chat-container">
        <ul id="messages"></ul>
        <form id="message-form" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" placeholder="Type your message..." autocomplete="off" />
            <button id="sendButton">Send</button>
        </form>
    </div>

    <script>
        // Replace with actual match_id and player_id
        const matchId = 1; // Example match ID
        const playerId = 2; // Example player ID

        // Connect to the WebSocket server
        const ws = new WebSocket(`ws://${window.location.host}/matchs/ws/${matchId}/${playerId}`);

        // Handle WebSocket events
        ws.onopen = () => {
            console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
            const messages = document.getElementById("messages");
            const message = document.createElement("li");
            message.textContent = event.data;
            messages.appendChild(message);
            messages.scrollTop = messages.scrollHeight; // Scroll to the latest message
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // Send a message to the WebSocket server
        function sendMessage(event) {
            event.preventDefault();
            const input = document.getElementById("messageText");
            if (input.value.trim() !== "") {
                ws.send(input.value);
                input.value = "";
            }
        }
    </script>
</body>
</html>

"""

@router.get("/chat", response_class=HTMLResponse)
async def get():
    return HTMLResponse(html)

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    try:
        print("WebSocket connection attempt")
        await websocket.accept()
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")
    except Exception as e:
        print(f"Error: {e}")

@router.websocket("/ws/{match_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, match_id: int, player_id: int, db: Session = Depends(get_db)):
    print(f"WebSocket connection attempt: match_id={match_id}, player_id={player_id}")
    try:
        # Accept the WebSocket connection
        await websocket.accept()

        matchs = get_all_matchs(db)
        print(matchs)
        players = get_all_players(db)
        print(players)

        # Retrieve the match and player from the database
        match = get_match_by_id(db, match_id)
        player = get_player_by_id(db, player_id)

        # Validate the match, player, and their association
        if not match:
            print("Match not found")
            await websocket.close(code=1008, reason="Match not found")
            return
        if not player:
            print("Player not found")
            await websocket.close(code=1008, reason="Player not found")
            return
        if player not in match.players:
            print("Player not in the match")
            await websocket.close(code=1008, reason="Player not in the match")
            return
        if match.status != "in_progress":
            print("Match not in progress")  
            await websocket.close(code=1008, reason="Match not in progress")
            return

        # Store the WebSocket connection for the player
        active_connections[player_id] = websocket
        print(f"Player {player_id} connected to match {match_id}")

        # Main WebSocket loop to handle messages
        while True:
            try:
                # Receive message from the player
                data = await websocket.receive_text()
                print(f"Received message from player {player_id}: {data}")

                # Save the chat message to the database
                save_chat_message(db, match_id=match_id, player_id=player_id, message=data)

                # Broadcast the message to other players in the match
                for p in match.players:
                    if p.id != player_id and p.id in active_connections:
                        await active_connections[p.id].send_text(f"{player.name}: {data}")
            except WebSocketDisconnect:
                print(f"Player {player_id} disconnected from match {match_id}")
                active_connections.pop(player_id, None)
                break
            except Exception as e:
                print(f"Error in WebSocket for player {player_id}: {e}")
                await websocket.close(code=1008, reason="Internal server error")
                break
    except Exception as e:
        print(f"Unexpected error: {e}")
        await websocket.close(code=1008, reason="Unexpected error")
