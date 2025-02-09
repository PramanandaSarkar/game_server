import GameBoard from "./GameBoard";
import ChatOption from "./ChatOption";

type Props = {};

function GuessingGame({}: Props) {
  return (
    <div className="container mx-auto p-4 grid grid-cols-2 gap-4">
      <GameBoard numberCount={4} />
      <ChatOption />
    </div>
  );
}
export default GuessingGame;