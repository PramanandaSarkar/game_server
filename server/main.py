import uvicorn
from fastapi import FastAPI, HTTPException
from typing import List, Optional

app = FastAPI()


# Client Class
class Client:
    def __init__(self, id: int, server_id: int):
        self.id = id
        self.level = 0
        self.server_id = server_id
        self.match_history: List[int] = []
        self.connection_logs: List[str] = []

    def __repr__(self):
        return f"Client(id={self.id}, server_id={self.server_id}, level={self.level})"


# Server Class
class Server:
    def __init__(self, id: int):
        self.id = id
        self.clients: List[Client] = []

    def create_new_client(self, client_id: int):
        if any(client.id == client_id for client in self.clients):
            raise ValueError("Client ID already exists on this server.")
        new_client = Client(client_id, self.id)
        self.clients.append(new_client)
        return new_client

    def remove_client(self, client_id: int):
        self.clients = [client for client in self.clients if client.id != client_id]

    def get_client(self, client_id: int) -> Optional[Client]:
        return next((client for client in self.clients if client.id == client_id), None)


# GameServerApp Class
class GameServerApp:
    def __init__(self):
        self.servers: List[Server] = []

    def add_server(self):
        new_server_id = len(self.servers) + 1
        server = Server(new_server_id)
        self.servers.append(server)
        return server

    def remove_server(self, server_id: int):
        self.servers = [server for server in self.servers if server.id != server_id]

    def get_server(self, server_id: int) -> Optional[Server]:
        return next((server for server in self.servers if server.id == server_id), None)


# Initialize the GameServerApp
game_server_app = GameServerApp()


@app.get("/")
def home():
    return {"message": "Welcome to the Multi-Server Game Matching Application!"}


# Server Management Endpoints
@app.post("/servers")
def create_server():
    new_server = game_server_app.add_server()
    return {"message": "Server created", "server_id": new_server.id}


@app.delete("/servers/{server_id}")
def delete_server(server_id: int):
    server = game_server_app.get_server(server_id)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    game_server_app.remove_server(server_id)
    return {"message": f"Server {server_id} deleted"}


@app.get("/servers")
def list_servers():
    return {"servers": [{"id": server.id, "clients": len(server.clients)} for server in game_server_app.servers]}


# Client Management Endpoints
@app.post("/servers/{server_id}/clients")
def add_client(server_id: int, client_id: int):
    server = game_server_app.get_server(server_id)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    try:
        new_client = server.create_new_client(client_id)
        return {"message": "Client created", "client": vars(new_client)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/servers/{server_id}/clients/{client_id}")
def remove_client(server_id: int, client_id: int):
    server = game_server_app.get_server(server_id)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    server.remove_client(client_id)
    return {"message": f"Client {client_id} removed from server {server_id}"}


@app.get("/servers/{server_id}/clients")
def list_clients(server_id: int):
    server = game_server_app.get_server(server_id)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return {"clients": [vars(client) for client in server.clients]}


# Simple Match-Making System
@app.post("/servers/{server_id}/match")
def match_clients(server_id: int):
    server = game_server_app.get_server(server_id)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    if len(server.clients) < 2:
        raise HTTPException(status_code=400, detail="Not enough clients to match")
    # Simple matching: Pair first two clients
    client1, client2 = server.clients[0], server.clients[1]
    client1.match_history.append(client2.id)
    client2.match_history.append(client1.id)
    return {
        "message": "Match created",
        "client1": vars(client1),
        "client2": vars(client2),
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=2002, reload=True)
