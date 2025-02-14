import { useState, useEffect } from "react";
import apiClient from "../api/api";

function GuessingGame() {
  const matchId = localStorage.getItem("matchId");
  const playerId = localStorage.getItem("userId");
  const teamName = localStorage.getItem("teamName");
  const [submitted, setSubmitted] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    if (submitted) {
      const interval = setInterval(async () => {
        try {
          const res = await apiClient.post("/match/get-result", { matchId });
          setResult(res.data);
          if (res.data.winner) {
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error fetching result:", error);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [submitted]);
  
  const handleNumberClick = (num: number) => {
    if (!submitted) {
      setSelectedNumber(num);
    }
  };

  const handleSubmit = async () => {
    if (!selectedNumber) return;
    try {
        const res = await apiClient.post("/match/submit-guess", { matchId, playerId, guess: selectedNumber });
        console.log("Response:", res.data);
        setSubmitted(true);
    } catch (error) {
        console.error("Submission failed:", error.response?.data || error);
    }
};


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="border p-4 shadow-lg rounded-lg">
        <h2 className="text-lg font-bold mb-2 text-center">
          {teamName ? `${teamName} - Game Board` : "Loading..."}
        </h2>
        <div className="grid grid-cols-3 gap-3 p-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className={`p-6 text-3xl font-bold rounded-lg transition ${
                selectedNumber === num ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
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
            submitted ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={handleSubmit}
          disabled={submitted || selectedNumber === null}
        >
          {submitted ? "Submitted! Waiting for result..." : "Submit"}
        </button>
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
            <h3 className="text-xl font-bold">Game Result</h3>
            <p>Winner: {result.winner}</p>
            <p>Red Team Score: {result.score.redTeamScore}</p>
            <p>Blue Team Score: {result.score.blueTeamScore}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuessingGame;
