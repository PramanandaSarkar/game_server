from fastapi import FastAPI
from app.routes import player, match

app = FastAPI(
    title="Matchmaking Game Server",
    description="A scalable game server with matchmaking functionality.",
    version="1.0.0",
)

# Register routes
app.include_router(player.router, prefix="/player", tags=["Player"])
app.include_router(match.router, prefix="/match", tags=["Match"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Matchmaking Game Server"}
