import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL; // Store API base URL in .env file

function GuessingGame() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const matchId = "123"; // Replace with actual match ID
  const playerId = localStorage.getItem("userId") || "456"; // Fetch from localStorage if available

  // Dynamically determine team name (example logic)
  const teamName = playerId === "456" ? "Team Blue" : "Team Green";

  // Handle number selection
  const handleNumberClick = (num: number) => {
    if (!submitted) setSelectedNumber(num);
  };

  // Submit selection to server
  const handleSubmit = async () => {
    if (selectedNumber === null) {
      alert("Please select a number!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/match/${matchId}/player/${playerId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: selectedNumber }),
      });

      if (response.ok) {
        alert("Selection submitted!");
        setSubmitted(true);
      } else {
        alert("Submission failed. Try again.");
      }
    } catch (error) {
      console.error("Error submitting selection:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="border p-4 shadow-lg rounded-lg">
        {/* Game Board */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2 text-center">{teamName} - Game Board</h2>
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
            disabled={submitted}
          >
            {submitted ? "Submitted!" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuessingGame;
