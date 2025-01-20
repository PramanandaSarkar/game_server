class Server:
    def __init__(self,id, maximumMatch, close_server):
        self.id = id
        self.maximumMatch = maximumMatch
        self.curr_match = []
        self.close_server = close_server
    def add_match(self, match_id):
        if len(self.curr_match) < self.maximumMatch:
            self.curr_match.append(match_id)
            print(f"Server {id} busy ")
        else:
            self.curr_match.append(match_id)

