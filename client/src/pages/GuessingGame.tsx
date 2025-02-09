import { useState, useEffect } from "react";

function GuessingGame() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [submitted, setSubmitted] = useState(false); // Tracks submission state

  const matchId = "123"; // Replace with actual match ID
  const playerId = "456"; // Replace with actual player ID

  // Handle number selection
  const handleNumberClick = (num) => {
    if (!submitted) setSelectedNumber(num);
  };

  // Submit selection to server
  const handleSubmit = async () => {
    if (selectedNumber === null) return alert("Please select a number!");

    try {
      const response = await fetch(`/api/${matchId}/${playerId}/endpoint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: selectedNumber }),
      });

      if (response.ok) {
        alert("Selection submitted!");
        setSubmitted(true); // Disable board after submission
      }
    } catch (error) {
      console.error("Error submitting selection:", error);
    }
  };

  // Fetch chat messages (Simulated real-time updates)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/${matchId}/chat`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    // Fetch messages every 2 seconds (Simulated real-time)
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle sending chat message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      await fetch(`/api/${matchId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, message: inputMessage }),
      });
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border p-4 shadow-lg rounded-lg">
        {/* Game Board */}
        <div className="bg-white p-4 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-lg font-bold mb-2 text-center">Game Board</h2>
          <div className="grid grid-cols-3 gap-3 p-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className={`p-6 text-lg font-bold rounded-lg transition ${
                  selectedNumber === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                } ${submitted ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleNumberClick(num)}
                disabled={submitted} // Disable selection after submission
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
            disabled={submitted} // Disable submit after submission
          >
            {submitted ? "Submitted!" : "Submit"}
          </button>
        </div>

        {/* Chat Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2 text-center">Chat</h2>
          <div className="h-64 overflow-y-auto border rounded-lg p-2 bg-gray-100">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet...</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="font-bold">{msg.playerId}: </span>
                  <span>{msg.message}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600 transition"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuessingGame;
