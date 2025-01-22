from sqlalchemy import Column, Integer, String
from config.database import Base

class Server(Base):
    __tablename__ = "servers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)



