import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/auth";

function HomePage() {
  const [userId, setUserId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      if (!userId.trim()) {
        setError("User ID cannot be empty.");
        return;
      }

      const response = await axios.post(`${API_URL}/login`, { userId });

      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId);
        setLoggedIn(true);
      }
    } catch (err) {
      setError("Login failed. User not found.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId("");
    setLoggedIn(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-8">
        <img src="/vite.svg" width={100} height={100} alt="hero" />
      </div>
      <div className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
        {loggedIn ? (
          <>
            <h1 className="text-2xl mb-4">Welcome, {userId}!</h1>
            <button className="p-2 bg-red-500 text-white rounded" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl mb-4">Login</h1>
            <input
              type="text"
              className="p-2 border rounded mb-2"
              placeholder="Enter your ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button className="p-2 bg-blue-500 text-white rounded" onClick={handleLogin}>
              Login
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
