import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/api";

const Games = () => {
  const userId = localStorage.getItem("userId");
  const [selectedType, setSelectedType] = useState<string>("");
  const [waiting, setWaiting] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [match, setMatch] = useState<any>(null);
  const navigate = useNavigate();

  const findmatch = async () => {
    try {
      const res = await apiClient.post("/match/make-match", {
        playerId: userId,
      });
      console.log(res.data);
      // if (res.data.inMatch) {
      //   setMatch(res.data.match);
      //   localStorage.setItem("matchId", res.data.matchId);
      //   localStorage.setItem("teamName", res.data.teamName);
      //   navigate(`/game/${res.data.matchId}`);
      // }
    } catch (error) {
      console.error("Error checking match:", error);
    }
  };

  const joinmatch = async () => {
    try {
      setWaiting(true);
      const res = await apiClient.post("/match/join-queue", {
        playerId: userId,
        matchType: selectedType,
      });
      console.log(res.data);
    } catch (error) {
      console.error("Error joining match:", error);
      setWaiting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(findmatch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="shadow-lg rounded-2xl w-2/3 bg-white p-6">
      <h1 className="text-2xl font-semibold text-black mb-4 text-center">Games</h1>
      <div className="w-1/2 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-center">Guessing Game</h2>
        <div className="grid grid-cols-2 gap-4">
          {[2, 4, 6, 10].map((count) => (
            <div
              key={count}
              className={`border p-2 rounded-md bg-gray-100 hover:bg-gray-300 transition hover:cursor-pointer ${
                selectedType === `${count}P` ? "bg-gray-400" : ""
              }`}
              onClick={() => setSelectedType(`${count}P`)}
            >
              {`${count}P`}
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-6 p-3 w-auto border rounded-lg bg-black text-white text-center hover:bg-gray-900 transition cursor-pointer"
        onClick={joinmatch}
      >
        {waiting ? "Waiting for Match..." : "Start Match"}
      </div>

      
    </div>
  );
};

export default Games;
