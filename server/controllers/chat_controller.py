from models.chat_messages import ChatMessage

def save_chat_message(db, player_id, match_id, message):
    chat_message = ChatMessage(player_id=player_id, match_id=match_id, message=message)
    db.add(chat_message)
    db.commit()
    db.refresh(chat_message)
    return chat_message