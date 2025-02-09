import Oneplate from "./Oneplate";

type GameBoardProps = {
  numberCount: number;
};

function GameBoard({ numberCount }: GameBoardProps) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-bold mb-2">Game Board</h2>
      <div className="grid grid-cols-2 gap-2">
        {[...Array(numberCount)].map((_, index) => (
          <Oneplate key={index} />
        ))}
      </div>
      <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
        Make a Guess
      </button>
    </div>
  );
}

export default GameBoard;
