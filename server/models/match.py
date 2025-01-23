from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

class Match(Base):
    __tablename__ = "matchs"
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="waiting")
    player_count = Column(Integer, default=0)
    players = relationship("Player", back_populates="match")

    chat_messages = relationship("ChatMessage", back_populates="match")