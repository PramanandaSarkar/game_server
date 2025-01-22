from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/matchs",
    responses={
        404:
        {
            "description": "Page not Found"

        }
    }
)

@router.get("/")
def get_all_matchs():
    return {"message": "All matchs"}