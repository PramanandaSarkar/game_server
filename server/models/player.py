from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base


class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(Integer)
    name = Column(String)
    level = Column(Integer, default=0)
    last_match_history = Column(String, default="LOSE")
    match_id = Column(Integer, ForeignKey("matchs.id"))
    match = relationship("Match", back_populates="players")
    chat_messages = relationship("ChatMessage", back_populates="player")