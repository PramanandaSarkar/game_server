from enum import Enum
from typing import List
# class Config:
#     LOG_PATH = "logs/app.log"
#     MAX_PLAYERS_PER_MATCH = 4
#     LEVEL_RANGE = 10


class GlobalConfig:
    timeScaling: int 


class ServerConfig:
    MATCH_LOG = "logs/match.log"
    PLAYER_CONNECTION_LOG = "logs/player.log"
    MATCH_DETAILS_LOG = "logs/match_details.log"

class MatchConfig:
    CONSIDER_MATCH_RESULT = 10


class Match_Type(Enum):
    TWO_PLAYER = 2
    FOUR_PLAYER = 4
    SIX_PLAYER = 6 
    EIGHT_PLAYER = 8
    TEN_PLAYER = 10

class Match:
    id: int
    matchType: Match_Type
    matchPlayer: int 

    def __init__(self, id: int, matchType: Match_Type):
        self.id = id
        self.matchType = matchType







class Player:
    id: int
    serverId: int
    rank: int
    connectionlog: List
    matchLog: List
    matchResult: List 
    inMatch: bool 
    def __init__(self, player_id:int, server_id:int, rank: int):
        self.id = player_id
        self.serverId = server_id
        self.rank = rank
        self.inMatch = False 
    
    def rankUp(self):
        self.rank += 1
    
    def formateLoginLogOut(action: str, time: str):
        return f"{action}\t{time}\n"
    def formateMatchStatus(action: str, time: str):
        return f"{action}\t{time}\n"
    def joinMatch(self, time: str):
        log_str = self.formateMatchStatus("JOIN_MATCH", time)
        self.inMatch = True
        self.matchLog(log_str)

    def disconnect(self,time: str):
        if self.inMatch:
            log_str = self.formateMatchStatus("DISCONNECTED", time)
            self.matchLog.append(log_str)
        log_str = self.formateLoginLogOut("LOGOUT", time)
        self.connectionlog.append(log_str)
    def connect(self,time: str):
        if self.inMatch:
            log_str = self.formateMatchStatus("CONNECTED", time)
            self.matchLog.append(log_str)
        log_str = self.formateLoginLogOut("LOGIN", time)
        self.connectionlog.append(log_str)
    def endMatch(self, time:str, isWin:bool):
        if isWin:
            self.rank += 1
        self.matchResult.append("1" if isWin else "0")
        if len(self.matchResult) > MatchConfig.CONSIDER_MATCH_RESULT:
            self.matchResult = self.matchResult[:MatchConfig.CONSIDER_MATCH_RESULT]
        log_str = self.formateMatchStatus("END_MATCH", time)
        self.matchLog(log_str, time)
    
    
    


    


class PlayerData:
    id: int
    rank: int
    previousMatch: str
    lastLogin: str




class MatchDetails:
    pass



class MatchMaking:
    pass

class Logger:
    pass 




