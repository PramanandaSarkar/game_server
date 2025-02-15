import { useState, useEffect } from "react";
import apiClient from "../api/api";
import { useNavigate } from "react-router-dom";

function GuessingGame() {
  const matchId = localStorage.getItem("matchId");
  const playerId = localStorage.getItem("userId");
  const teamName = localStorage.getItem("teamName");
  const [submitted, setSubmitted] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (submitted) {
      const interval = setInterval(async () => {
        
          const res = await apiClient.post("/match/get-result", { matchId });
          setResult(res.data);
          if (res.data.winner) {
            clearInterval(interval);
          }
        
      }, 1000); 

      return () => clearInterval(interval);
    }
  }, [matchId, submitted]);
  
  const handleNumberClick = (num: number) => {
    if (!submitted) {
      setSelectedNumber(num);
    }
  };

  const handleSubmit = async () => {
    if (!selectedNumber) alert("Please select a number.");
    else {
      setSubmitted(true);
      try {
        const res = await apiClient.post("/match/submit-guess", { "matchId": matchId, "playerId": playerId, "guess": selectedNumber });
        setResult(res.data);
      } catch (error) {
        console.error("Error submitting guess:", error);
      }
      setSelectedNumber(null);
      alert(`Submitted guess: ${selectedNumber}`);
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
                selectedNumber == num ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
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
          disabled={submitted || selectedNumber == null}
        >
          {submitted ? "Submitted! Waiting for result..." : "Submit"}
        </button>
      <div>
        <h1>result</h1>
        {result }
      </div>

        <div className="mt-4 p-2 border text-center" onClick={() => navigate("/")}>Back to Menu</div>
      </div>
    </div>
  );
}

export default GuessingGame;
