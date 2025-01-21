from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# Allow CORS for all origins (you can restrict it to a specific domain for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you can specify a list here if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Initialize the random number (game state)
random_int = random.randint(1, 9)

class GuessRequest(BaseModel):
    guess: int

@app.get("/")
def read_root():
    return {"message": "Welcome to the Number Guessing Game! Send your guess to /guess endpoint."}

@app.post("/guess")
def guess(request: GuessRequest):
    global random_int  # Use the global random number
    user_guess = request.guess
    
    if user_guess < 1 or user_guess > 9:
        return {"message": "Please guess a number between 1 and 9.", "status": "error"}
    
    if user_guess < random_int:
        return {"message": "Too low! Try again.", "status": "continue"}
    elif user_guess > random_int:
        return {"message": "Too high! Try again.", "status": "continue"}
    else:
        random_int = random.randint(1, 9)  # Reset the game with a new number
        return {"message": "Congratulations! You guessed the correct number.", "status": "win"}
