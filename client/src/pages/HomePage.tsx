import { useState } from "react";
import { redirect } from "react-router-dom";

function HomePage() {
  const [userId, setUserId] = useState("");
  const [inputUserId, setInputUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Simulate API call to get new User ID
  const generateNewUserId = async () => {
    // try {
    //   const response = await fetch("http://localhost:5000/api/new-user-id"); // Change URL as needed
    //   const data = await response.json();
    //   setUserId(data.userId);
    //   setErrorMessage(""); // Clear any previous error
    // } catch (error) {
    //   setErrorMessage("Failed to get a new User ID. Try again.");
    // }
    setUserId((Math.floor(Math.random() * 100000)).toString())
  };

  // Simulate login function
  const handleLogin = async () => {
    if (!inputUserId) {
      setErrorMessage("Please enter a valid User ID.");
      return;
    }
    console.log(inputUserId)
    try {
      const response = await fetch(`http://localhost:4000/player/${inputUserId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }        
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setErrorMessage("");
        // alert("Login successful!"); // You can replace this with navigation
        localStorage.setItem("userId", data.id);
        redirect("/game");

      } else {
        setErrorMessage(data.message || "Invalid User ID. Try again.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="w-[400px] p-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-semibold text-center text-black mb-4">
          Log In to the Game
        </h1>

        <div className="flex flex-col">
          <label className="text-black font-medium mb-1">User ID</label>
          <input
            type="text"
            placeholder="Enter user ID"
            value={inputUserId}
            onChange={(e) => setInputUserId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-black"
          />
          <button
            onClick={handleLogin}
            className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Login
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-600 text-center mt-4">{errorMessage}</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-black">Don't have a User ID?</p>
          <button
            onClick={generateNewUserId}
            className="mt-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Get New User ID
          </button>

          {userId && (
            <p className="mt-2 text-black">
              Your new User ID: <span className="font-semibold">{userId}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
