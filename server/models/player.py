from sqlalchemy import Column, Integer, String
from config.database import Base


class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(Integer)
    name = Column(String)
    level = Column(Integer)
    match_history = Column(String)
    