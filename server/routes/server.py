from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/servers",
    responses={
        404:
        {
            "description": "Page not Found"

        }
    }
)

@router.get("/")
def get_all_servers():
    return {"message": "All servers"}