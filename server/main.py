from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import Base, engine
from routes import player 
from routes import match
from routes import server



# Initialize the database
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Include routers
app.include_router(player.router)
app.include_router(match.router)
app.include_router(server.router)

@app.get("/")
def introduction():
    return {"message": "Server API running..."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    # make redirected to /docs
    # uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    # redirec_to_docs = True

