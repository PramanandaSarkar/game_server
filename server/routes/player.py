from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/players",
    responses={
        404: {
            "description": "Page not found"
        }
    }
)

@router.get("/")
def get_all_players():
    return {"message": "All players"}
