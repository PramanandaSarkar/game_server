from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from config.database import Base    


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matchs.id"))
    match = relationship("Match", back_populates="chat_messages")
    player_id = Column(Integer, ForeignKey("players.id"))
    player = relationship("Player", back_populates="chat_messages")
    message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)