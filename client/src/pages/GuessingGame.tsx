import { useState, useEffect } from "react";
import apiClient from "../api/api";

function GuessingGame() {
  const matchId = localStorage.getItem("matchId");
  const playerId = localStorage.getItem("userId");
  const [submitted, setSubmitted] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchInfo = async () => {
      try {
        const response = await apiClient.post('/match', {
            matchId, 
        });
        console.log(response.data);
        setTeamName(response.data.teamName);
      } catch (error) {
        console.error("Failed to fetch match info:", error);
      }
    };

    if (matchId) {
      fetchMatchInfo();
    }
  }, [matchId]);

  // Handle number selection
  const handleNumberClick = (num: number) => {
    if (!submitted) {
      setSelectedNumber(num);
    }
  };

  // Submit selection to server
  const handleSubmit = async () => {
    try {
      const res = await apiClient.post("/match/submit-guess", {
        matchId,
        playerId,
        guess: selectedNumber,
      });

      console.log(res.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  // if (!matchId || !playerId) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="border p-4 shadow-lg rounded-lg">
        {/* Game Board */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2 text-center">
            {teamName ? `${teamName} - Game Board` : "Loading..."}
          </h2>
          <div className="grid grid-cols-3 gap-3 p-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className={`p-6 text-3xl font-bold rounded-lg transition ${
                  selectedNumber === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                } ${submitted ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleNumberClick(num)}
                disabled={submitted}
              >
                {num}
              </button>
            ))}
          </div>
          <button
            className={`mt-4 w-full py-2 rounded-lg transition ${
              submitted
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            onClick={handleSubmit}
            disabled={submitted || selectedNumber === null}
          >
            {submitted ? "Submitted!" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuessingGame;
