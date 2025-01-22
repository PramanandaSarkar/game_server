import asyncio
import websockets

async def test_websocket():
    match_id = 1   # Update match_id
    player_id = 1  # Update player_id

    url = f"ws://127.0.0.1:8000/ws/{match_id}/{player_id}"

    try:
        async with websockets.connect(url) as websocket:
            print("Connected to WebSocket.")
            await websocket.send("Hello from Player 1!")
            while True:
                response = await websocket.recv()
                print("Received:", response)
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"Connection failed: {e.status_code}")
    except Exception as e:
        print(f"An error occurred: {e}")

asyncio.run(test_websocket())
