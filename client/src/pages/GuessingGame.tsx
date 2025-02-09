import { useParams } from "react-router-dom";
import GameBoard from "../components/guessingGame/GameBoard";
import ChatOption from "../components/guessingGame/ChatOption";


type Props = {};

function GuessingGame({}: Props) {
  const { players } = useParams();
  const numberOfPlayers = Number(players) || 2;
  
  return (
    <div className="container mx-auto p-4 grid grid-cols-2 gap-4">
      <GameBoard numberCount={numberOfPlayers} />
      <ChatOption />
    </div>
  );
}

export default GuessingGame;